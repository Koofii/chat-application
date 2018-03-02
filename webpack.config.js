let path = require("path");
let WebpackNotifierPlugin = require("webpack-notifier");

module.exports = {
    entry: "./js/index.js",
    output: {
        path: __dirname + "/dist/js",
        filename: "index.js"
    },
    devServer: {
        
        port: 9000,
        hot: true
    },
    plugins: [
        new WebpackNotifierPlugin({ alwaysNotify: true }),
    ],
};