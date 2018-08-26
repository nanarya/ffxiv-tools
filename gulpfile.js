const gulp = require("gulp");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const stylus = require("gulp-stylus");
const autoprefixer = require("gulp-autoprefixer");
const pug = require("gulp-pug");
const browserSync = require("browser-sync");

//setting : paths
const paths = {
  "styl": "./htdocs_dev/styl/",
  "css": "./htdocs/assets/css/",
  "pug": "./htdocs_dev/pug/",
  "html": "./htdocs/",
  "js_dev": "./htdocs_dev/js/",
  "js_dist": "./htdocs/assets/js/",
  "img_dev": "./htdocs_dev/img/",
  "img_dist": "./htdocs/assets/img/"
}
//setting : Stylus Options
const stylusOptions = {
  //compress: true
}
//setting : Pug Options
const pugOptions = {
  pretty: true
}
//pug
gulp.task("pug", () => {
  return gulp.src([paths.pug + "**/*.pug", "!" + paths.pug + "**/_*.pug"])
    .pipe(plumber({ errorHandler: notify.onError("おだやかじゃないわね...!!：<%= error.message %>") }))
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(paths.html));
});

//Stylus
gulp.task("stylus", () => {
  gulp.src([paths.styl + "**/*.styl", "!" + paths.styl + "**/_*.styl"])
    .pipe(plumber({ errorHandler: notify.onError("おだやかじゃないっ！：<%= error.message %>") }))
    .pipe(stylus(stylusOptions))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.css));
});
//JS
gulp.task('js', () => {
    gulp.src([paths.js_dev + "**/*.js", "!" + paths.js_dev + "**/_*.js"])
        .pipe(gulp.dest(paths.js_dist));
});
gulp.task('img', () => {
    gulp.src(paths.img_dev + "**/*")
        .pipe(gulp.dest(paths.img_dist));
});

//Browser sync
gulp.task("browser-sync", () => {
  browserSync({
    server: {
      baseDir: paths.html
    }
  });

  gulp.watch(paths.html + "**/*.html", ["reload"]);
  gulp.watch(paths.css + "**/*.css", ["reload"]);
  gulp.watch(paths.js_dist + "**/*.js", ["reload"]);
  gulp.watch(paths.img_dist + "**/*", ["reload"]);

});
gulp.task("reload", () => {
  browserSync.reload();
})

//watch
gulp.task("watch", () => {
  gulp.watch(paths.styl + "**/*.styl", ["stylus"]);
  gulp.watch([paths.pug + "**/*.pug", "!" + paths.pug + "**/_*.pug"], ["pug"]);
  gulp.watch(paths.js_dev + "**/*.js", ["js"]);
  gulp.watch(paths.img_dev + "**/*", ["img"]);
});

gulp.task("default", ["browser-sync", "watch", "img"]);
