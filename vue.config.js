const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // development server port 8000
    port: 8002,
    proxy: {
      '/api': {
        target: 'http://183.6.107.44:9094',
        // pathRewrite: { '^/api': '' },
        ws: false,
        changeOrigin: true
      }
    }
  },
  // 修改 src 目录 为 examples 目录
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
        .add('/packages')
        .end()
      .use('babel')
        .loader('babel-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        })
  },
  lintOnSave:false,
  // transpileDependencies: true //transpileDependencies为false,则原封不动的打包进bundle,否则，根据browserslist情况决定是否需要打polyfill
})
