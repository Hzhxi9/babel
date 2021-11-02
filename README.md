一、 Babel 日常用法

1. 常见 plugin 和 preset

> plugin 和 preset 的区别: 所谓的 preset 就是一些 plugin 组成的合集, 可以将 preset 理解成就是一些 plugin 整合成为的一个包

2. 常见 Preset

- [更多 Preset 查看](https://babeljs.io/docs/en/babel-preset-env)

- `babel-preset-env`

  @babel/preset 是一个智能预设, 它可以将我们高版本 Javascript 代码进行转译根据内置的规则转译成低版本的 Javascript 代码

  preset-env 内部集成了绝大多数的 plugin(state > 3)的转译插件, 它会根据对应参数进行代码转译

  [具体参数配置](https://babeljs.io/docs/en/babel-preset-env#options)

  > @babel/preset-env 不会包含任何地狱 stage3 的 JavaScript 语法提案。 如果需要兼容低版本于 Stage3 阶段的语法则需要额外引入对应的 Plugin 进行兼容

  > 需要额外注意的是 babel-preset-env 仅仅针对语法阶段的转译, 比如转译箭头函数、const/let 语法。针对一些 api 或者 ES6 内置模块的 polyfill, preset-env 是无法进行转译的。

- babel-preset-react

  通常在使用 React 的 jsx 时, 实质上 jsx 最终会编译成为 React.createElement()方法

  babel-preset-react 这个预设起到就是将 jsx 进行转译的作用

- babel-preset-typescript

  对于 typescript 代码, 有两种方式去编译 typescript 代码成为 JavaScript 代码

  - 使用 tsc 命令, 结合 cli 命令参数方式或者 tsconfig 配置未见进行编译 ts 代码
  - 使用 babel, 通过 babel-preset-typescript 代码进行编译 ts 代码

3. 常见 Plugin

- [更多 Plugin 查看](https://babeljs.io/docs/en/plugins-list)

关于常见的 Plugin 其实大多数都集成在 babel-preset-env 中, 当不能支持最新的 js 语法, 此时可以查阅对应的 Babel Plugin List 找到对应的语法插件添加进行 babel 配置

> 一些不常用的 package, 比如@babel/register: 它会改写 require 命令, 为它加上一个钩子。 此后每当使用 require 加载.js、.jsx、.es 和.es6 后缀名文件, 就会先用 Babel 进行转码

4. 前端基建中 Babel 配置详解

关于前端构建工具, 无论使用 webpack 还是 rollup 又或者任何构建工具, 内部都离不开不了 Babel 相关配置

关于 webpack 中日常使用的 babel 相关配置主要涉及以下三个相关插件:

- babel-loader
- babel-core
- babel-preset-env

> webpack 中 loader 的本质就是一个函数, 接受我们的源代码作为入参同时返回新的内容

5. babel-loader

babel-loader 的本质就是一个函数, 我们匹配到对应的 jsx/tsx 的文件交给 babel-loader

```js
/**
 * @param sourceCode 源代码内容
 * @param options babel-loader 相关参数
 * @returns 处理后的代码
 */
function babelLoader(sourceCode, options) {
  //...
  return targetCode;
}
```

babel-loader 参数注入形式

- 支持直接通过 loader 的参数形式注入
- loader 函数内部通过读取.babelrc/babel.config.js/babel.config.json 等文件注入配置

[babel 在各种基建项目的初始化方式](https://babeljs.io/setup)

6. babel-core

babel-loader 仅仅是识别匹配文件和接受对应参数的函数, 那么 babel 在编译代码过程中核心库就是@babel/core

babel-core 是 babel 最核心的一个编译库, 它可以将我们代码进行词法分析 -> 语法分析 -> 语义分析过程从而生成 AST 抽象语法树, 从而对呀这棵树的操作之后再通过编译称为新的代码

> babel-core 其实相当于@babel/parse 和 @babel/generator 这两个包的合体

babel-core 通过 transform 方法将我们的代码进行编译

关于 babel-core 中的编译方法有很多种, 比如直接接受字符串形式的 transform 方法或者接受 js 文件路径的 transformFile 方法进行文件整体编译

[同时支持同步以及异步的方法](https://babeljs.io/docs/en/babel-core)

完善对于的 babel-loader 函数

```js
const core = require('@babel/core');
/**
 * @param sourceCode 源代码内容
 * @param options babel-loader 相关参数
 * @returns 处理后的代码
 */
function babelLoader(sourceCode, options) {
  // 通过transform方法编译传入的源代码
  core.transform(sourceCode);
  return targetCode;
}
```

7. babel-preset-env

babel-loader 本质是一个函数, 他在内部通过 babel/core 这个核心包进行 JavaScript 代码编译

但针对代码的转译需要告诉 babel 以什么样的规则进行转化, 此时 babel-preset-env 在这里充当的就是这个作用: 告诉 babel 需要以什么样的规则进行代码转译

```js
const core = require('@babel/core');
/**
 * @param sourceCode 源代码内容
 * @param options babel-loader 相关参数
 * @returns 处理后的代码
 */
function babelLoader(sourceCode, options) {
  // 通过transform方法编译传入的源代码
  core.transform(sourceCode, {
      presets: ['babel-preset-env'],
      plugin: [...]
  });
  return targetCode
}
```

> 这里 plugin 和 preset 其实是同一个东西, 所以将 plugin 直接放在代码中。 同理一些其他的 preset 或者 plugin 也是发挥这样的作用

8. Babel 相关 polyfill 内容

- polyfill 的概念

  首先先了解三个概念:

  - 最新的 ES 语法, 比如箭头函数, let/const
  - 最新的 ES API: 比如 promise
  - 最新的 ES 实例/静态方法, 比如 String.prototype.include

bebel-preset-env 仅仅之后转化最新的 es 语法, 并不会转化对应的 API 和实例方法, 比如说 ES6 钟的 Array.from 静态方法, babel 是不会转译这个方法的, 如果想在低版本浏览器中识别并且运行 Array.form 方法达到我们的预期就需要额外引入 polyfill 进行在 Array 上添加实现这个方法

- 简单总结

  - 语法层面: preset-env 完全可以胜任语法层面的转化
  - 一些内置方法模块: 需要一系列类似"垫片"的工具进行补充实现这部分内容的低版本代码实现。

- 针对 polyfill 方法的内容, babel 中涉及两个方法来解决

  - @babel/polyfill
  - @babel/runtime
  - @babel/plugin-transform-runtime

9. @babel/polyfill

- 介绍

  通过[babel/polyfill](https://babeljs.io/docs/en/babel-polyfill)通过往全局对象上添加属性以及直接修改内置对象的 prototype 添加方法来实现 polyfill

  比如需要支持 String.prototype.include, 在引入 babel/polyfill 这个包之后, 它会在全局 String 的原型对象添加 include 方法从而支持我们的 JS API

  这种方式本质是往全局对象/内置对象上挂载属性, 这种方式难免会造成全局污染。

- 应用

  在 babel-preset-env 中存在一个 useBuiltIns 参数, 这个参数决定了如何在 preset-env 中使用@babel/polyfill

  ```json
  {
    "presets": [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": false
        }
      ]
    ]
  }
  ```

  - useBuiltIns -- "usage" | "entry" | false

    - false: 当我们使用 preset-env 传入 useBuiltIns 参数时候, 默认为 false。它表示仅仅会转化最新 ES 语法, 并不会转化任何 API 和方法
    - entry: 当传入 entry 时, 需要我们在项目入口文件中手动引入一次 core-js, 他会根据我们配置的浏览器兼容性列表(browserList)然后全量引入不兼容的 polyfill

      > 在 bebel7.4.0 之后, @babel/polyfill 被废弃, 变成另外两个包的集成: "core-js/stable"; "regenerator-runtime/runtime"。可以在[这里](https://babeljs.io/docs/en/babel-polyfill), 但是他们的使用方式是一致的, 只是在入口文件引入的包不同

      > [浏览器兼容性列表配置方式](https://github.com/browserslist/browserslist)

      ```js
      /**
       * 项目入口文件需要额外引入polyfill
       * core-js 2.0 中是使用"@babel/polyfill" core-js3.0 版本中变化成为了上边两个包
       */
      import '@babel/polyfill';

      // babel
      {
          "presets":[
              ["@babel/preset/env", {
                  "useBuiltIns": "entry"
              }]
          ]
      }
      ```

      > 同时需要注意的是, 在使用 useBuiltIns: entry/useage 时, 需要额外指定 core-js 这个参数。 默认为使用 core-js2.0
      > 所谓 core-js 就是垫片的现实, 它会实现一系列内置方法或者 Promise 等 API
      > core-js 2.0 版本跟随 preset-env 一起安装, 不需要单独安装

      - usage

        配置 entry 时, preset-env 会基于我们的浏览器列表进行全量引入 polyfill。 所谓全量引入比如我们代码中仅仅使用了 Array.from 这个方法。但是 polyfill 并不仅仅会引入 Array.from, 同时也会引入 Promise、Array.prototype.include 等其他并未使用到的方法, 这就会造成引入的体积太大

        此时就引入了 useBuiltIns: usage 配置

        当我们配置 useBuiltIns: usage 时, 会根据配置的浏览器兼容, 以及代码中使用到的 API 进行引入 polyfill 按需添加

        当使用 usage 时, 我们不需要额外在项目入口中引入 polyfill 了, 它会根据我们项目使用到的进行按需引入

        ```json
        {
          "presets": [
            [
              "@babel/preset-env",
              {
                "useBuildIns": "usage",
                "core-js": 3
              }
            ]
          ]
        }
        ```
