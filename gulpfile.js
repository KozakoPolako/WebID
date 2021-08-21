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
    
    // if (serverProcess !== null) {
    //     console.log("pid", serverProcess.pid);
    //     //spawn("taskkill", ["/pid", serverProcess.pid, '/f', '/t']);
    //     serverProcess.kill();
    // }
    
    

    // serverProcess = fork ("WebID_Server/app/app.js");

    // // serverProcess = exec("node WebID_Server/app/app.js", (err, stdout, stderr) => {
    // //     console.log(stdout);
    // //     console.log(stderr);

    // //     //cb(err);
    // // });
    // ///serverProcess = spawn ("start node WebID_Server/app/app.js")

    // console.log(serverProcess.pid);

    // return serverProcess;
    // //  exec('mongod --dbpath ./data', function (err, stdout, stderr) {
    // //     console.log(stdout);
    // //     console.log(stderr);
    // //     cb(err);
    // //   });
    if (serverProcess) {
        serverProcess.stop();
    }
    serverProcess = gls.new("./WebID_Server/app/app.js");
    serverProcess.start();
    cb();

}


const client = (cb) => {
    browserSync.init({
        server: {
            baseDir: "./WebID_Client/dist"
        },
        notify: false,
        host: "192.168.0.246",
        port: 3000,
        open: false
    });
    cb();
}

const css = () => {
    return gulp.src("WebID_Client/src/scss/main.scss")
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: "compressed"
            }).on("error", sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("WebID_Client/dist/css"))
        .pipe(browserSync.stream());
}

const js = (cb) => {
    return webpack(require("./webpack.config.js"), (err, stats) => {
        if (err)
            throw err;
        console.log(stats);
        browserSync.reload();
        cb();
    });
}

const html = () =>{
    return gulp.src("WebID_Client/src/**/*.html")
        .pipe(gulp.dest("WebID_Client/dist/"))
        
    

}

const watch = (cb) => {
    gulp.watch("WebID_Client/src/scss/**/*.scss",{usePolling:true}, gulp.series((css)));
    gulp.watch("WebID_Client/src/js/**/*.js", gulp.series(js));
    gulp.watch("WebID_Client/src/*.html", gulp.series(html));
    gulp.watch("WebID_Server/**/*.js", gulp.series(server));
    cb();
}

exports.default = gulp.series(html,css,js,client,server,watch);

exports.html = html;
exports.css = css;
exports.js = js;

exports.watch = watch;