/**
 * 当进行AST遍历时，如果碰到节点类型为ArrowFunctionExpression时
 * 就会进入visitor对象中的ArrowFunctionExpression方法从而执行对应逻辑从而进行操作当前树。
 *
 * 1. 如何知道每个节点的类型, 比如ArrowFunctionExpression 就是箭头函数的类型
 *
 *    - 首先babel/types中涵盖了所有的节点类型。我们可以通过查阅babel/types查阅对应的节点类型
 *    - 也可以在 axtexplorer 中查阅对应代码生成的AST从而获得对应的节点
 *
 * 2. 什么是nodePath参数，它有什么作用？
 *
 *    - 每个方法都存在一个nodePath参数, 所谓nodePath参数都可以理解成一个节点路径
 *      包含了这个树上这个节点分叉的所有信息和对应的api,
 *      注意这里可以强调是路径，你可以在这里查阅它的含义以及对应的所有API
 *
 *  要将代码进行编译，难免要进行AST节点的修改。
 *  本质上我们还是通过对于AST节点的操作修改AST从而生成我们想要的代码结果。
 *
 *  - 我们可以通过astexplorer分别输入我们的源代码和期望的编译后代码得到对应的AST结构。
 *  - 之后，我们在对比这两棵树的结构从而在原有的AST基础上进行修改得到我们最终的AST。
 *  - 最后 babel transform方法会根据我们修改后的AST生成对应的源代码。
 *
 *  通过对比 input and output
 *  1. output中将箭头函数的节点ArrowFunctionExpression替换成为了FunctionDeclaration。
 *  2. output中针对箭头函数的body，调用表达式声明ExpressionStatement时，传入的arguments从ThisExpression更换成了Identifier。
 *  3. 同时output在箭头函数同作用域内额外添加了一个变量声明，const _this = this。
 */

/**babel/types 工具库 该模块包含手动构建TS的方法，并检查AST节点的类型。(根据不同节点类型进行转化实现) */
const babelTypes = require('@babel/types');

function ArrowFunctionExpression(path) {
  const code = path.node;
  hoistFunctionEnvironment(path);
  node.type = 'FunctionDeclaration';
}

/**
 *
 * @param {*} nodePath 当前节点路径
 */
function hoistFunctionEnvironment(nodePath) {
  /**
   * 往上查找 直到找到最近顶部非箭头函数的this p.isFunction() && !p.isArrowFunctionExpression()
   * 或者找到根节点 p.isProgram()
   */
  const thisEnvFn = nodePath.findParent(p => {
    return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram();
  });

  /**
   * 接下来查找当前作用域中国呢哪些地方用到了this的节点路径
   */
  const thisPath = getScopeInfoInformation(thisEnvFn);
  const thisBindingName = generateBindName(thisEnvFn);

  /**
   * thisEnvFn 中添加一个变量, 变量名: thisBindingsName, 变量值为 this
   * 相当于 const _this = this
   */
  thisEnvFn.scope.push({
    /**
     * 调用babelTypes中生成对应节点
     * 详细你可以在这里查阅到 https://babeljs.io/docs/en/babel-types
     */
    id: babelTypes.identifier(thisBindingName),
    init: babelTypes.thisExpression(),
  });

  thisPath.forEach(thisPath => {
    /**将this替换成_this */
    const replaceNode = babelTypes.identifier(thisBindingName);
    thisPath.replaceWith(replaceNode);
  });
}

/**
 * 查找当前作用域内this使用的地方
 * @param {*} nodePath 节点路径
 */
function getScopeInfoInformation(nodePath) {
  const thisPath = [];
  /**
   * 调用nodePath中的traverse方法进行便利
   * https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md
   */
  nodePath.traverse({
    /**
     * 深度遍历节点路径, 找到内部this语句
     */
    thisExpression(thisPath) {
      thisPath.push(thisPath);
    },
  });

  return thisPath;
}

/**
 * 判断之前是否存在 _this 这里简单处理下, 直接返回固定的值
 * @param {*} path 节点路径
 * @param {*} name
 * @param {*} n
 */
function generateBindName(path, name = '_this', n = '') {
  if (path.scope.hasBinding(name)) generateBindName(path, '_this' + n, parseInt(n) + 1);
  return name;
}


module.exports = {
    hoistFunctionEnvironment,
    arrowFunctionPlugin: {
        visitor: { ArrowFunctionExpression }
    }
}
