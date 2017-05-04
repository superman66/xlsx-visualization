'use strict';
const webpack = require("webpack");
module.exports = {
    context: __dirname + "/",
    entry: __dirname + "/app.js",
    output: {
        filename: "bundle.js",
    },
    devServer: {
        contentBase: __dirname + "/",  // New
    },
};