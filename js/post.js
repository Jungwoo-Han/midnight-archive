(function () {
  function $(selector) {
    return document.querySelector(selector);
  }

  function renderDeletedComment() {
    return '<div class="comment deleted-comment">삭제된 댓글입니다.</div>';
  }

  function renderComment(comment) {
    var escapeHtml = window.Board.escapeHtml;
    if (comment.deleted) return renderDeletedComment();
    return [
      '<div class="comment">',
      '<div class="comment-meta"><b>' + escapeHtml(comment.author) + '</b><span>' + escapeHtml(comment.ip) + '</span><span>' + escapeHtml(comment.time) + '</span></div>',
      '<p>' + escapeHtml(comment.text) + '</p>',
      '</div>'
    ].join("");
  }

  function renderImage(post) {
    var escapeHtml = window.Board.escapeHtml;
    return '<img src="' + escapeHtml(post.image) + '" alt="첨부 이미지" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';"><div class="image-placeholder is-fallback"><b>첨부사진 1</b><span>이미지 파일을 불러오지 못했습니다</span></div>';
  }

  function renderImageBlock(post) {
    var escapeHtml = window.Board.escapeHtml;
    if (!post.image) return "";
    return [
      '<div class="post-image-frame">' + renderImage(post) + '</div>',
      '<div class="image-caption">첨부 이미지 1개 / <a href="' + escapeHtml(post.image) + '" target="_blank" rel="noopener">원본보기</a></div>'
    ].join("");
  }

  function initVote(post) {
    var likeButton = $("#likeButton");
    var dislikeButton = $("#dislikeButton");
    if (!likeButton || !dislikeButton) return;
    var likes = post.likes;
    var dislikes = post.dislikes;
    likeButton.addEventListener("click", function () {
      likes += 1;
      $("#likeCount").textContent = likes;
    });
    dislikeButton.addEventListener("click", function () {
      dislikes += 1;
      $("#dislikeCount").textContent = dislikes;
    });
  }

  function initCommentForm() {
    var form = $("#commentForm");
    var notice = $("#commentNotice");
    if (!form || !notice) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      notice.textContent = "현재 페이지에서는 댓글이 저장되지 않습니다.";
    });
  }

  function renderPost() {
    var escapeHtml = window.Board.escapeHtml;
    var params = new URLSearchParams(window.location.search);
    var id = Number(params.get("id"));
    var post = (window.POSTS || []).find(function (item) { return item.id === id; });
    var container = $("#postDetail");

    if (!container) return;
    if (!post) {
      container.innerHTML = '<section class="content-box"><h2 class="missing-title">게시글을 찾을 수 없습니다.</h2><p class="muted">목록에서 다시 선택해주세요.</p><a class="small-link" href="index.html">목록으로</a></section>';
      return;
    }

    var comments = post.comments || [];
    var visibleCount = comments.filter(function (comment) { return !comment.deleted; }).length;
    document.title = post.title + " - 틈새게시판";
    container.innerHTML = [
      '<article class="post-view content-box">',
      '<div class="post-head">',
      '<a class="back-link" href="index.html">목록</a>',
      '<h2>' + window.Board.labelHtml(post) + escapeHtml(post.title) + '</h2>',
      '<div class="post-meta"><span>글쓴이 <b>' + escapeHtml(post.author) + '</b></span><span>IP ' + escapeHtml(post.ip) + '</span><span>' + escapeHtml(post.date) + ' ' + escapeHtml(post.time) + '</span><span>조회 ' + post.views + '</span><span>추천 <b id="likeCount">' + post.likes + '</b></span><span>비추천 <b id="dislikeCount">' + post.dislikes + '</b></span></div>',
      '</div>',
      renderImageBlock(post),
      '<div class="post-body">' + post.body.map(function (paragraph) { return '<p>' + escapeHtml(paragraph) + '</p>'; }).join("") + '</div>',
      '<div class="vote-row"><button type="button" id="likeButton">추천</button><button type="button" id="dislikeButton">비추천</button></div>',
      '</article>',
      '<section class="comments-box content-box">',
      '<h3>댓글 (' + visibleCount + ')</h3>',
      '<div class="comment-list">' + comments.map(renderComment).join("") + '</div>',
      '<form id="commentForm" class="comment-form"><input type="text" placeholder="닉네임"><textarea placeholder="댓글을 입력하세요"></textarea><button type="submit">등록</button><p id="commentNotice"></p></form>',
      '</section>'
    ].join("");

    initVote(post);
    initCommentForm();
  }

  document.addEventListener("DOMContentLoaded", renderPost);
})();
