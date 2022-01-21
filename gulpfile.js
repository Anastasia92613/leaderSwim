const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();

// Styles

const styles = () => {
    return gulp.src("source/less/style.less")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(less())
        .pipe(postcss([
            autoprefixer(),
            csso()
        ]))
        .pipe(rename("style.min.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
    return gulp.src("source/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("build"));
}

// Scripts

const scripts = () => {
    return gulp.src("source/js/index.js")
        // .pipe(terser())
        // .pipe(rename("index.min.js"))
        .pipe(gulp.dest("build/js"))
        .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const optimizeImages = () => {
    return gulp.src("source/img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.mozjpeg({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("build/img"))
}

exports.images = optimizeImages;

const copyImages = () => {
    return gulp.src("source/img/**/*.{png,jpg,svg}")
        .pipe(gulp.dest("build/img"))
}

exports.images = copyImages;

// WebP

const createWebp = () => {
    return gulp.src("source/img/**/*.{jpg,png}")
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;


// Copy

const copy = (done) => {
    gulp.src([
            "source/fonts/*.{woff2,woff, otf}",
            "source/*.ico",
            "source/img/**/*.svg",
            "!source/img/icons/*.svg",
        ], {
            base: "source"
        })
        .pipe(gulp.dest("build"))
    done();
}

exports.copy = copy;

const fonts = () => {
    return gulp.src("source/fonts/*.*")
        .pipe(gulp.dest("build/fonts"))
        .pipe(sync.stream());
  }
  
  exports.fonts = fonts;

// Clean

const clean = () => {
    return del("build");
};

// Server

const server = (done) => {
    sync.init({
        server: {
            baseDir: "build"
        },
        cors: true,
        notify: false,
        ui: false,
    });
    done();
}

exports.server = server;

// Reload

const reload = (done) => {
    sync.reload();
    done();
}

// Watcher

const watcher = () => {
    gulp.watch("source/less/**/*.less", gulp.series(styles));
    gulp.watch("source/js/script.js", gulp.series(scripts));
    gulp.watch("source/*.html", gulp.series(html, reload));
    gulp.watch("source/img/*.*", gulp.series(html, reload));
    gulp.watch("source/js/*.*", gulp.series(html, reload));
}

// Build

const build = gulp.series(
    clean,
    copy,
    optimizeImages,
    gulp.parallel(
        styles,
        html,
        fonts,
        scripts,
        createWebp
    ),
);

exports.build = build;

// Default


exports.default = gulp.series(
    clean,
    copy,
    copyImages,
    gulp.parallel(
        styles,
        html,
        fonts,
        scripts,
        createWebp
    ),
    gulp.series(
        server,
        watcher
    ));