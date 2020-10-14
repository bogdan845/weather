
/* ==========================
LIST OF TASKS AT THE BOTTOM
===========================*/

var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var gulpCleanCss = require("gulp-clean-css");
var gulpSourcemaps = require("gulp-sourcemaps");
var gulpMinify = require("gulp-minify");
var gulpHtmlMin = require("gulp-htmlmin");
var gulpImagemin = require("gulp-imagemin");
var del = require("del");
var gulpCache = require("gulp-cache");


// simple test task
gulp.task("test", function (done) {
    console.log("finaly it's worked");
    done();
})


// sass
// ! exclude files that are not needed
var scss_path = "./src/assets/scss/**/*.scss";

function styles() {
    return gulp.src(scss_path)
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(sass())
        .pipe(gulpCleanCss({compatibilty: "ie9"}))
        .pipe(gulpSourcemaps.write("./"))
        .pipe(gulp.dest("./src/assets/css"))
        .pipe(gulp.dest("./dist/assets/css"))
        .pipe(browserSync.reload({stream: true}));
}


// images
var images_path = "./src/assets/images/**/*";
function images() {
    return (gulp.src(images_path))
        .pipe(gulpImagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
        }))
        .pipe(gulp.dest("./dist/assets/images"))
}


// js
var js_path = "./src/assets/js/**/*.js";

function scripts() {
    return gulp.src(js_path)
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpMinify({
            noSource: true,
            ext: {
                min: ".js"
            }
        }))
        .pipe(gulpSourcemaps.write("./"))
        .pipe(gulp.dest("./dist/assets/js"))
}


// watcher
var html_path = "./src/*.html";

function watch() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
    gulp.watch(html_path).on("change", browserSync.reload);
    gulp.watch(scss_path, styles).on("change", browserSync.reload);
    gulp.watch(js_path, scripts).on("change", browserSync.reload);
}


// cache
function cache() {
    return (
        gulpCache.clearAll()
    )
}


// clean dist folder
function clean() {
    return (
        del("dist")
    )
}


// html
function html() {
    return gulp.src("./src/*html")
        .pipe(gulpHtmlMin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist"));
}


// fonts
var fonts_path = "./src/assets/fonts/**/*";

function fonts() {
    return gulp.src(fonts_path)
        .pipe(gulp.dest("./dist/assets/fonts"))
}


/*list of tasks*/
gulp.task("html", html);
gulp.task("styles", styles);
gulp.task("images", images);
gulp.task("fonts", fonts);
gulp.task("scripts", scripts);
gulp.task("watch", watch);
gulp.task("cache", cache)
gulp.task("clean", clean);

gulp.task("build", gulp.series(
    clean,
    gulp.parallel(cache, html, styles, fonts, images, scripts))
);