## chrome-plugin-memos

![GitHub license](https://img.shields.io/github/license/zishume/chrome-plugin-memos)
![GitHub Repo stars](https://img.shields.io/github/stars/zishume/chrome-plugin-memos)
![GitHub issues](https://img.shields.io/github/issues/zishume/chrome-plugin-memos)
![GitHub forks](https://img.shields.io/github/forks/zishume/chrome-plugin-memos)
![GitHub commit](https://img.shields.io/github/commit-activity/t/zishume/chrome-plugin-memos)
![GitHub followers](https://img.shields.io/github/followers/zishume)
![Discord](https://img.shields.io/discord/1126519222172925952)

在线文档: https://zishume.github.io/chrome-plugin-memos/

>因为没有开发者账号，所以无法上架商店，后续考虑开个谷歌开发者账号，使用方法在下方。

Memos 的 chrome 插件。

经过测试，通过 api 打开扩展显示笔记要比原网站速度快2-3倍。估计是memos网站功能太多导致，现在我只把 memos 网站用做 api 后台管理，日常写笔记用扩展打开，体验感很好。

## 使用

下载已打包好的 dist-zip 文件 [releases](https://github.com/zishume/chrome-plugin-memos/releases/tag/1.0)，解压拖拽到 chrome 扩展中。

**提供两种显示方式**

**1. 弹窗**

![1693821747158](https://imgurl.zishu.me/images/1693821747158.jpg)

**2. 扩展页面**

将下面网址收藏到导航栏，点击即可打开。

```
chrome-extension://gdoomfiohdlmgpefhknbligngcfcndac/options.html
```

![1693821450418](https://imgurl.zishu.me/images/1693821450418.jpg)

## 开发

```
npm install
npm run dev
```

将 `dist` 文件拖动到chrome扩展程序中。

![1693821942444](https://imgurl.zishu.me/images/1693821942444.jpg)

## 功能

在设置中中输入网站域名、用户名，密码进行配置。

**已开发**

编辑，发布，归档，编辑历史笔记功能。

## 演示

![1693821385911](https://imgurl.zishu.me/images/1693821385911.jpg)
![1693821450418](https://imgurl.zishu.me/images/1693821450418.jpg)