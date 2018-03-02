let path = require("path");
let WebpackNotifierPlugin = require("webpack-notifier");

module.exports = {
    entry: "./js/index.js",
    output: {
        path: __dirname + "/dist/js",
        filename: "index.js"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 9000,
    },
    plugins: [
        new WebpackNotifierPlugin({ alwaysNotify: true }),
    ],
};