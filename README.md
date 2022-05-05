# cc-image-tag-new

## 简介

这是一个思源笔记的挂件,用于从笔记工作空间内容创建图形笔记白板.

## 0.1.8更新

选择链接到思源的卡片时通过alt+点击卡面可以直接开始操作编辑卡片内容

ctrl+点击卡片中的块链接将会直接将链接目标新建到画板中

优化缩放性能

alt+鼠标滚轮缩放优化

最大缩放倍数提高到十倍

更新readme,之后每个版本readme记录当前版本与上个版本更新内容

改进画板新建方式

更新版本后请清除缓存并硬刷新以使更新生效

## 0.1.7更新

挂件更新检测,当集市有更新时弹出提示

### 修复本地工作空间

通过127.0.0.1访问时可以指定工作空间,卡片内容将会以卡片名+id短码的形式保存在工作空间中,未绑定到思源的卡片markdown内容双向更新,绑定到思源的卡片**markdown内容只支持从思源到markdown的单向更新**

## 详细功能帮助在挂件中按f1打开帮助画板查看

如上,在挂件中按下f1打开帮助画板

## 使用

GitHub pages 不知道为什么弄起来有点问题,很多文件404了,改天另外找个地方托管一下,暂时无法在线试用了.

更新:现在可以在线试用了,在线的版本基本上是开发到哪更新到哪,如果无法访问需要先通过http://42.193.15.241:6806来获取授权,授权码是思源笔记装修折腾群的群号,线上版本仅供娱乐,请勿滥用.

注意这只是一个思源笔记的挂件,要正常使用全部功能的话,正确的打开方式应该是安装思源笔记之后以挂件的形式使用它,请到下面这个地址安装思源笔记:

[思源笔记 - 本地优先的个人知识管理系统，支持 Markdown 排版、块级引用和双向链接 (b3log.org)](https://b3log.org/siyuan/)

然后参考思源笔记的帮助文档,以挂件的形式使用.

# 感谢

本挂件使用了以下开源库,排名不分先后,可能有遗漏,发现请及时提醒作者补充:

[vuejs/vue: 🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web. (github.com)](https://github.com/vuejs/vue)

[dexie/Dexie.js: A Minimalistic Wrapper for IndexedDB (github.com)](https://github.com/dexie/Dexie.js)

[Vanessa219/vditor: ♏ 一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora）和分屏预览模式。An In-browser Markdown editor, support WYSIWYG (Rich Text), Instant Rendering (Typora-like) and Split View modes. (github.com)](https://github.com/Vanessa219/vditor)

[88250/lute: 🎼 一款结构化的 Markdown 引擎，支持 Go 和 JavaScript。A structured Markdown engine that supports Go and JavaScript. (github.com)](https://github.com/88250/lute)

[FranckFreiburger/http-vue-loader: load .vue files from your html/js (github.com)](https://github.com/FranckFreiburger/http-vue-loader)

[ReactiveX/rxjs: A reactive programming library for JavaScript (github.com)](https://github.com/ReactiveX/rxjs)

[ElemeFE/element: A Vue.js 2.0 UI Toolkit for Web (github.com)](https://github.com/ElemeFE/element)

[konvajs/konva: Konva.js is an HTML5 Canvas JavaScript framework that extends the 2d context by enabling canvas interactivity for desktop and mobile applications. (github.com)](https://github.com/konvajs/konva)

[konvajs/vue-konva: Vue &amp; Canvas - JavaScript library for drawing complex canvas graphics using Vue. (github.com)](https://github.com/konvajs/vue-konva)

[mauricius/vue-draggable-resizable: Vue2 Component for draggable and resizable elements. (github.com)](https://github.com/mauricius/vue-draggable-resizable)

本挂件受到以下软件启发:

[Scapple | Literature &amp; Latte (literatureandlatte.com)](https://www.literatureandlatte.com/scapple/overview)

[TheBrain中文官网_3D思维导图软件_TheBrain12_TheBrain11下载正版授权-thebrain中文网](http://www.thebrain.com.cn/)
