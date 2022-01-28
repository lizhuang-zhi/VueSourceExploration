const path = require('path');

module.exports = {
    // 模式，开发
    mode: 'development',
    // 入口
    entry: './src/index.js',
    // 打包到什么文件
    output: {
        filename: 'bundle.js'
    },
    // 配置 webpack-dev-server
    devServer: {
        // 静态文件根目录
        contentBase: path.join(__dirname, "www"),
        compress: false,
        port: 8080,
        // 虚拟打包的路径，bundle.js文件并没有真正生成
        publicPath: "/xuni"
    }
}