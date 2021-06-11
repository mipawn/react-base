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


## UI
> 使用antd
TODO: 主题色设置一次, 全局生效

* 版本 4.16.1
* 主题色， 3个地方
  1. .env > REACT_APP_PRIMARY_COLOR => 运行时的配置
  2. craco.config.js > primaryColor => antd 主题色
  3. index.html > .loading-spinner > color => 项目初始化 loading 颜色


## TODO

框架

1. 路由

   - [x] 路由
   - [x] 嵌套路由
   - [x] 动态路由（菜单问题待验证）
   - [x] 导航式路由
   - [x] 懒加载

2. scss

   - [x] Module scss
   - [x] 全局变量
   - [x] Scoped scss
   - [ ] 不需要module，根据babel做判断
   - [ ] Cssnao(暂时不需要)
   - [ ] Module scss ts 提示

3. 全局状态管理

   - [x] redux + redux-sage
   - [x] ts 支持

4. 权限

   - [ ] 页面级
   - [ ] 按钮级
   - [ ] 考虑别人实现的策略

5. layout

   - [ ] 使用pro 的样式实现基本的layout和基本逻辑
   - [x] 引入antd 并做懒加载
   - [x] 主题色

6. eslint
   - [x] eslint
   - [x] Commit 校验
   - [x] commit 规范
   - [x] changelog

7. http
   - [ ] http请求
   - [ ] mock

8. 国际化
   - [ ] i18

9. 页面开始白屏
   - [x] 页面加载初始loading

10. 编译分析
   - [ ] 打包分析
   - [ ] webpack 优化

11. 文档

   - [ ] 目录结构
   - [ ] 各部分说明

