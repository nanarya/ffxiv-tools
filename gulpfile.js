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
  "jsdev": "./htdocs_dev/js/",
  "js": "./htdocs/assets/js/"
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
gulp.task('js', function() {
    gulp.src([paths.jsdev + "**/*.js", "!" + paths.styl + "**/_*.js"])
        .pipe(gulp.dest(paths.js));
});

//Browser sync
gulp.task("browser-sync", () => {
  browserSync({
    server: {
      baseDir: paths.html
    }
  });
  gulp.watch(paths.js + "**/*.js", ["reload"]);
  gulp.watch(paths.html + "**/*.html", ["reload"]);
  gulp.watch(paths.css + "**/*.css", ["reload"]);
});
gulp.task("reload", () => {
  browserSync.reload();
})

//watch
gulp.task("watch", () => {
  gulp.watch(paths.styl + "**/*.styl", ["stylus"]);
  gulp.watch([paths.pug + "**/*.pug", "!" + paths.pug + "**/_*.pug"], ["pug"]);
  gulp.watch(paths.js + "**/*.js", ["js"]);
});

gulp.task("default", ["browser-sync", "watch"]);
