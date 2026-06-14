# 틈새게시판 정적 웹사이트

가상의 한국식 인터넷 게시판 `틈새게시판 - 생활오류 제보판`을 구현한 순수 정적 웹사이트입니다. 실제 사이트명, 로고, 상표, 주소, 업체명은 사용하지 않았고, 로컬에서 `index.html`을 바로 열어 볼 수 있습니다.

## 실행 방법

별도 서버나 빌드 도구가 필요 없습니다.

1. 프로젝트 폴더에서 `index.html`을 더블클릭합니다.
2. 목록에서 게시글 제목을 누르면 `post.html?id=글ID` 형식으로 상세 페이지가 열립니다.
3. 이미지 파일이 없거나 로드되지 않으면 어두운 placeholder가 표시됩니다.

## 폴더 구조

```text
index.html
post.html
README.md
css/
  style.css
js/
  app.js
  post.js
data/
  posts.js
assets/
  img/
    locker-fish.png
    sauce-fridge.png
    receipt-dryer.png
    black-bag-freezer.png
    photo-booth-wall.png
    bus-stop-clothes.png
    mountain-shoes.png
    restricted-area.png
```

## 게시글 추가 방법

`data/posts.js`의 `window.POSTS = [...]` 배열에 객체를 추가하면 됩니다. 각 객체에는 `id`, `category`, `label`, `title`, `author`, `ip`, `date`, `time`, `views`, `likes`, `dislikes`, `image`, `body`, `comments`, `isNotice` 필드를 넣습니다.

댓글은 `{ author, ip, time, text }` 형식으로 작성하고, 삭제된 댓글은 `{ deleted: true }`로 넣습니다.

## 이미지 추가 방법

게시글의 `image` 값에 `assets/img/파일명.png` 경로를 넣고, 같은 이름의 이미지 파일을 `assets/img` 폴더에 넣으면 자동으로 표시됩니다. 파일이 없거나 경로가 틀리면 상세 페이지에서 placeholder가 대신 보입니다.

## 주의

이 프로젝트는 가상의 게시판입니다. 실제 커뮤니티명, 실제 로고, 실제 상표, 실제 주소, 특정 실존 업체명, 실제 인물 사진을 포함하지 않도록 구성했습니다.
