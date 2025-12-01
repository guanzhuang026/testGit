// 1. 引入Node.js内置模块（处理路径）
const path = require("path");
// 2. 引入VueLoader插件（必须，否则vue-loader无法工作）
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// 3. 导出Webpack配置对象
module.exports = {
  // 入口文件：项目从这里开始打包
  entry: './src/main.js',
  
  // 输出配置：打包后的文件存哪里
  output: {
    path: path.resolve(__dirname, './dist'), // 输出到根目录的dist文件夹
    filename: 'bundle.js' // 打包后的JS文件名
  },
  
  // 模块规则：告诉Webpack如何处理不同类型的文件
  module: {
    rules: [
      // 规则1：处理.vue文件（核心）
      {
        test: /\.vue$/, // 匹配所有.vue后缀的文件
        use: ['vue-loader'] // 用vue-loader解析.vue文件
      },
      
      // 规则2：处理CSS文件（包括.vue里的<style>）
      {
        test: /\.css$/, // 匹配所有.css后缀的文件
        use: [
          'vue-style-loader', // 把CSS插入到页面<style>标签（适配Vue）
          'css-loader'        // 解析CSS文件（处理@import、url()）
        ]
      },
      
      // 规则3：处理Less文件（可选，之前配置过，保留）
      {
        test: /\.less$/, // 匹配所有.less后缀的文件
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader' // 把Less编译为CSS
        ]
      },
      
      // 规则4：处理图片文件（之前配置过，保留）
      {
        test: /\.(png|jpg|gif|svg)$/, // 匹配图片格式
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000, // 小于5KB转base64
              name: 'images/[hash].[ext]', // 大于5KB输出到dist/images
              esModule: false // 解决图片路径[object Module]问题
            }
          }
        ]
      },
      
      // 规则5：处理字体文件（之前配置过，保留）
      {
        test: /\.(woff|woff2|svg|ttf|eot)$/, // 匹配字体格式
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000, // 字体转base64
            esModule: false
          }
        }
      }
    ]
  },
  
  // 插件配置：VueLoader必须加这个插件
  plugins: [
    new VueLoaderPlugin(), // 启用VueLoader插件（关键）
    new webpack.BannerPlugin({
    banner: `/**
 * 项目名称：Webpack + Vue3 项目
 * 作者：小猪
 * 版权声明：© 2025 保留所有权利
 * 打包日期：${new Date().toLocaleString()}
 */`
  }),
  new HtmlWebpackPlugin({
      title: "Webpack + Vue3 项目", // 页面标题（会替换模板里的 <title>）
      template: "./index.html", // 你的 HTML 模板路径（用你自己写的 HTML 当模板）
      filename: "index.html" // 打包后生成的 HTML 文件名（默认就是 index.html，可自定义）
    })
  ],
  
  // 解析配置：让Webpack能识别.vue和.js文件（不用写后缀）
  resolve: {
    extensions: ['.vue', '.js'], // 导入时可以省略这些后缀（比如import App from './App'）
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js' // 告诉Webpack用Vue的ES模块版本
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        // 压缩选项（只讲关键的，默认已够用）
        terserOptions: {
          compress: {
            drop_console: true, // 可选：删除 console.log（生产环境推荐，减小体积）
            drop_debugger: true // 可选：删除 debugger 语句（防止调试代码泄露）
          },
          format: {
            comments: true, // 保留版权注释（默认 false，这里设为 true，避免版权被删掉）
            // 只保留版权注释，去掉其他注释（可选，更精准）
            comments: /© 2025 保留所有权利/ // 正则匹配你版权注释里的关键词
          }
        }
      })
    ]
  }
};