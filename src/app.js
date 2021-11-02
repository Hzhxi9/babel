const babel = require('@babel/core');

const sourceFunc = require('@babel/plugin-transform-arrow-functions');

const sourceCode = `const func = () => { console.log(this) }`;

const targetCode = babel.transform(sourceCode, {
  plugins: [sourceFunc],
});

console.log(targetCode);
