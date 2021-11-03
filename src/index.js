/**
 * babel插件实质上就是一个对象，里边会有一个属性visitor。
 * 这个visitor对象上会有很多方法，每个方法都是基于节点的名称去命名的。
 */
const babel = require('@babel/core');

const { arrowFunctionPlugin } = require('./plugin-transform-arrow-functions');

const sourceCode = `const arrowFunc = () => { console.log(this) };`;

/**
 * 当babel/core中的transform方法进行AST的遍历时会进入visitor对象中匹配，
 * 如果对应节点的类型匹配到了visitor上的属性那么就会从而执行相应的方法。
 */
const target = babel.transform(sourceCode, {
  plugins: [arrowFunctionPlugin],
});

/**编译后的代码 */
console.log(target.code);
