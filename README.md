# file-preview

## 插件的安装

### 引入插件

- npm i h-file-preview

### 基本用法

- import Vue from 'vue';
- import HFilePreview from 'h-file-preview';
- Vue.use(HFilePreview);

## git相关

- git init 初始化gitxiangm
- git checkout -b master 新建一个master分支
- git add . 本地暂存区
- git commit -m "xxx" git 本地提交
- git remote add origin 项目地址
- git remote -v 检查是否连接成功
- git push -u origin master 提交到远程master分支上
- 注意：检查github上是否有ssh，没有的话要再本地生成，然后配置到github上

## npm发包过程

- 写好组件后
- 配置package.json和.npmignore
- 要对入口进行打包 pnpm run build:lib vue-cli-service build --mode prod --name h-file-preview --target lib --dest lib packages/index.js
- 首先要测试账号
- 登录npm时要检查自己的npm镜像是否npm
- 登录npm login
- 登录后通过npm publish 进行发包

