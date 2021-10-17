const gulp = require('gulp');
const gls = require('gulp-live-server');
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const webpack = require("webpack")
const { exec , spawn, fork } = require("child_process");
//const { stdout } = require('process');
let serverProcess = null; 
//sass.compiler = require("sass");

const server = (cb) => {
    
    if (serverProcess) {
        serverProcess.stop();
    }
    serverProcess = gls.new("./WebID_Server/app/server.js");
    serverProcess.start();
    cb();

}


const client = (cb) => {

    exec("npm run client_start");
    cb();
}


const watch = (cb) => {
    
    gulp.watch("WebID_Server/**/*.js", gulp.series(server));
    cb();
}

exports.default = gulp.series(server,client,watch);

exports.client = client;
exports.server = gulp.series(server, watch);

exports.watch = watch;