# console

## 技术栈
ts + vue 3 + vue-router 4 + vuex 4 + vue-cli
## 部分脚本

本地开发
```sh
yarn serve
```

项目打包
```sh
yarn build
```

## lint

commit 时有检验，error 不通过
### eslint
airbnb 规范
### stylelint
使用 stylelint-config-sass-guidelines

### commit
采用angular 规范，使用git cz

feat: 新特性
fix: 修改问题
refactor: 代码重构
docs: 文档修改
style: 代码格式修改, 注意不是 css 修改
test: 测试用例修改
chore: 其他修改, 比如构建流程, 依赖管理.

> 推荐全局安装
```sh
git cz
```

## 目录结构
