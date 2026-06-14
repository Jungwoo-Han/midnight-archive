(function () {
  var posts = window.POSTS || [];
  var categories = ["전체", "무인시설", "공공장소", "외곽/산길", "사진제보", "질문", "후기", "공지"];
  var activeCategory = "전체";
  var searchTerm = "";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function postUrl(id) {
    return "post.html?id=" + encodeURIComponent(id);
  }

  function visibleComments(post) {
    return (post.comments || []).filter(function (comment) {
      return !comment.deleted;
    });
  }

  function labelHtml(post) {
    if (!post.label) return "";
    return '<span class="post-label ' + (post.isNotice ? "notice-label" : "") + '">[' + escapeHtml(post.label) + "]</span>";
  }

  function renderTabs() {
    var tabWrap = $("#categoryTabs");
    if (!tabWrap) return;
    tabWrap.innerHTML = categories.map(function (category) {
      return '<button type="button" class="tab-button' + (category === activeCategory ? " is-active" : "") + '" data-category="' + escapeHtml(category) + '">' + escapeHtml(category) + "</button>";
    }).join("");
    tabWrap.addEventListener("click", function (event) {
      var button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      renderTabs();
      renderTable();
    });
  }

  function getFilteredPosts() {
    var normalized = searchTerm.trim().toLowerCase();
    return posts.filter(function (post) {
      var categoryMatch = activeCategory === "전체" || post.category === activeCategory || (activeCategory === "공지" && post.isNotice);
      var searchMatch = !normalized || post.title.toLowerCase().indexOf(normalized) > -1 || post.author.toLowerCase().indexOf(normalized) > -1;
      return categoryMatch && searchMatch;
    });
  }

  function renderTable() {
    var tbody = $("#postRows");
    var count = $("#resultCount");
    if (!tbody) return;
    var filtered = getFilteredPosts();
    var notices = filtered.filter(function (post) { return post.isNotice; });
    var regulars = filtered.filter(function (post) { return !post.isNotice; });
    var ordered = notices.concat(regulars);

    if (count) {
      count.textContent = "총 " + ordered.length + "개";
    }

    if (!ordered.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">검색 결과가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = ordered.map(function (post) {
      var commentCount = visibleComments(post).length;
      return [
        '<tr class="' + (post.isNotice ? "notice-row" : "") + '">',
        '<td class="col-no">' + (post.isNotice ? "공지" : post.id) + "</td>",
        '<td class="col-title"><a href="' + postUrl(post.id) + '">' + labelHtml(post) + '<span class="title-text">' + escapeHtml(post.title) + '</span><span class="comment-count">[' + commentCount + "]</span></a></td>",
        '<td class="col-author">' + escapeHtml(post.author) + "</td>",
        '<td class="col-date">' + escapeHtml(post.date) + "</td>",
        '<td class="col-views">' + post.views + "</td>",
        '<td class="col-likes">' + post.likes + "</td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function initSearch() {
    var input = $("#siteSearch");
    if (!input) return;
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
      input.value = params.get("q");
      searchTerm = input.value;
    }
    input.addEventListener("input", function () {
      searchTerm = input.value;
      if ($("#postRows")) renderTable();
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !$("#postRows")) {
        window.location.href = "index.html?q=" + encodeURIComponent(input.value.trim());
      }
    });
  }

  function renderSidebar() {
    var sidebar = $("#sidebar");
    if (!sidebar) return;
    var popular = posts
      .filter(function (post) { return !post.isNotice; })
      .slice()
      .sort(function (a, b) { return (b.views + b.likes * 12) - (a.views + a.likes * 12); })
      .slice(0, 7);

    var recentComments = [];
    posts.forEach(function (post) {
      (post.comments || []).forEach(function (comment) {
        if (!comment.deleted && recentComments.length < 7) {
          recentComments.push(comment);
        }
      });
    });

    sidebar.innerHTML = [
      '<section class="side-box login-box"><h3>로그인</h3><input type="text" placeholder="아이디"><input type="password" placeholder="비밀번호"><button type="button">로그인</button><p><a href="#">회원가입</a> | <a href="#">아이디찾기</a></p></section>',
      '<section class="side-box"><h3>실시간 인기글</h3><ol class="popular-list">' + popular.map(function (post, index) {
        return '<li><span>' + (index + 1) + '</span><a href="' + postUrl(post.id) + '">' + escapeHtml(post.title) + '</a></li>';
      }).join("") + "</ol></section>",
      '<section class="side-box"><h3>최근 댓글</h3><ul class="recent-comments">' + recentComments.map(function (comment) {
        return '<li><b>' + escapeHtml(comment.author) + ':</b> ' + escapeHtml(comment.text).slice(0, 34) + (comment.text.length > 34 ? "..." : "") + "</li>";
      }).join("") + "</ul></section>",
      '<section class="ad-stack">' + renderAd("SELF STORAGE 24", "새벽에도 보관·수령 가능", "무인창고 첫 달 무료") + renderAd("분실물 임시보관", "상자 단위 접수", "사진 확인 후 찾아가기") + renderAd("야간 수령함", "비대면 보관함", "오늘 23:40까지 접수") + "</section>",
      '<section class="side-box guide-box"><h3>운영 안내</h3><p>위치 특정 댓글은 삭제될 수 있습니다.</p><p>얼굴/차량번호는 가리고 올려주세요.</p><p>사유지·통제구역 진입 사진은 삭제됩니다.</p></section>'
    ].join("");
  }

  function renderAd(title, subtitle, button) {
    return '<div class="text-ad"><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(subtitle) + '</span><em>' + escapeHtml(button) + '</em></div>';
  }

  function initIndex() {
    if (!$("#postRows")) return;
    renderTabs();
    renderTable();
  }

  window.Board = {
    escapeHtml: escapeHtml,
    postUrl: postUrl,
    visibleComments: visibleComments,
    labelHtml: labelHtml,
    renderSidebar: renderSidebar
  };

  document.addEventListener("DOMContentLoaded", function () {
    initSearch();
    initIndex();
    renderSidebar();
  });
})();
