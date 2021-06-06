## 路由

#### 编程式路由
* 引入 router 下的 history
* 使用 useHistory
* 使用 props 里的history

## log 日记类型
#### 主要type
> 会加入到 changelog
* feat:     增加新功能
* fix:      修复bug

#### 特殊type
> 此种类型不会加入到 changelog
* docs:     只改动了文档相关的内容
* style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
* build:    构造工具的或者外部依赖的改动，例如webpack，npm
* refactor: 代码重构时使用
* revert:   执行git revert打印的message
* test:     添加测试或者修改现有测试
* perf:     提高性能的改动
* ci:       与CI（持续集成服务）有关的改动
* chore:    不修改src或者test的其余修改，例如构建过程或辅助工具的变动

## eslint
#### 规范
* airbnb
* react
* ts 规范

## commit
commit 使用 angular 规范，使用git cz，推荐全局下载使用，[相关文章](https://juejin.cn/post/6844903606815064077)
```sh
npm install -g commitizen cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```
#### 自定义
请和团队其他成员协议通过后再修改

## 发布
> 后面ci/cd 之后，就不需要手动修改 version了
发布前请先升级version
```sh
npm version [<newversion>]
```