const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave:false,
  // transpileDependencies: true //transpileDependencies为false,则原封不动的打包进bundle,否则，根据browserslist情况决定是否需要打polyfill
})
