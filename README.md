# 어드민템플릿 따라하기

하는 김에 번들링(esbuild), scss(dart-sass), xslt(인라인svg 때문에) 같이 공부

## 페이지
* https://edp1096.github.io/html-svg-study/dist
* https://edp1096.github.io/html-svg-study/dist/svg-list.html

## Build
* Esbuild 사용
* `events.js`, `style.css`
    * `events.js`, `style.css` 각 한개씩만 생성. 여러개 생성은 어려워서 못하겠다
    * 앞으로 어디에 뭘 어떻게 넣을지 모르기 때문에 `html`파일에는 `index.html` 막줄처럼 직접 넣어줘야 됨
* dart-sass, node modules 준비
```cmd
X:\> get_sass.cmd
X:\> yarn
```
* Build or watch
```cmd
X:\> yarn dist
```
or
```cmd
X:\> yarn watch
```
* Clean
```cmd
X:\> clean.cmd
```

## 어드민템플릿 출처
* https://webdesign.tutsplus.com/tutorials/building-an-admin-dashboard-layout-with-css-and-a-touch-of-javascript--cms-33964

## xslt - inline svg
* https://www.w3schools.com/xml/xsl_client.asp
* https://www.youtube.com/watch?v=W--Yhp0m35A
* https://stackoverflow.com/questions/36651402/how-can-i-show-all-symbols-in-an-svg-file
