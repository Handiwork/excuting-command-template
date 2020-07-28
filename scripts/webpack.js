const config = require('./webpack.config');
const webpack = require('webpack');

function watch() {
    const compiler = webpack(config);
    compiler.watch({}, (err, stats) => {
        console.log(stats.toString({ colors: true }))
    })
}

function build() {
    const compiler = webpack(config);
    compiler.options.mode = "production";
    compiler.run();
}

module.exports = {
    watch,
    build
}

