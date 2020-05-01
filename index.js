/**
 * @File
 * Gulp powered frontend tools.
 *
 */

const config = {
  sass: {
    srcFiles: ["./src/scss/**/*.scss", "./src/scss/**/*.css"],
    outDir: "./src/scss"
  },
  js: {
    srcFiles: ["./src/js/**/*.js"],
    outDir: "./src/js"
  },
  distDir: {
    dir: "./dist",
    publicCssDir: "./dist/css",
    publicJsDir: "./dist/js"
  }
};

/**
 * Imports.
 */
const gulpStylelint = require("gulp-stylelint");
const gulpSass = require("gulp-sass");
const gulpSourcemaps = require("gulp-sourcemaps");
const gulpRename = require("gulp-rename");
const gulpPostcss = require("gulp-postcss");
const gulpEslint = require("gulp-eslint");
const gulpBabel = require("gulp-babel");
const gulpUglify = require("gulp-uglify");

/**
 * PostCSS plugins.
 */
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

/**
 * Option sets provider.
 */
const options = {
  gulpStylelint: {
    reporters: [{ formatter: "string", console: true }],
  },
  gulpStylelintFix: {
    reporters: [{ formatter: "string", console: true }],
    fix: true,
  },
  gulpSass: {
    outputStyle: "expanded"
  },
  gulpAutoprefixer: {
    grid: "autoplace",
    remove: false,
  },
};

/**
 * Plugin sets provider.
 */
const plugins = {
  gulpPostcss: [
    autoprefixer(options.gulpAutoprefixer),
    cssnano(),
  ],
};

/**
 * Main export.
 */
module.exports = (gulp) => {
  // SASS TASKS
  // ==========

  // Task: sourcemap, sass, postcss([autoprefix, cssnano])
  const taskSass = () =>
    gulp.src(config.sass.srcFiles)
      .pipe(gulpSourcemaps.init())
      .pipe(gulpSass(options.gulpSass))
      .pipe(gulpPostcss(plugins.gulpPostcss))
      .pipe(gulpRename({ suffix: ".min" }))
      .pipe(gulpSourcemaps.write("./"))
      .pipe(gulp.dest(config.distDir.publicCssDir));
  taskSass.displayName = "sass";
  taskSass.description = "Task to compile sass files.";
  gulp.task(taskSass);

  // Task: stylelint
  const taskSassLint = () =>
    gulp.src(config.sass.srcFiles)
      .pipe(gulpStylelint(options.gulpStylelint));
  taskSassLint.displayName = "sass:lint";
  taskSassLint.description = "Task to lint sass files.";
  gulp.task(taskSassLint);

  // Task: stylelint fix
  const taskSassLintFix = () =>
    gulp.src(config.sass.srcFiles)
      .pipe(gulpStylelint(options.gulpStylelintFix))
      .pipe(gulp.dest(config.sass.outDir));
  taskSassLintFix.displayName = "sass:lint:fix";
  taskSassLintFix.description = "Task to fix sass lint.";
  gulp.task(taskSassLintFix);

  // JavaScript TASKS
  // ================

  // Task: babel, uglify
  const taskJS = () =>
    gulp.src(config.js.srcFiles)
      .pipe(gulpBabel({presets: ["@babel/env"]}))
      .pipe(gulpUglify())
      .pipe(gulpRename({suffix: ".min"}))
      .pipe(gulp.dest(config.distDir.publicJsDir));
  taskJS.displayName = "js";
  taskJS.description = "Task to compile js files.";
  gulp.task(taskJS);

  // Task: eslint (options: /.eslintrc)
  const taskJSLint = () =>
    gulp.src(config.js.srcFiles)
      .pipe(gulpEslint())
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError());
  taskJSLint.displayName = "js:lint";
  taskJSLint.description = "Task to lint js files.";
  gulp.task(taskJSLint);

  // Task: eslint fix
  const taskJSLintFix = () =>
    gulp.src(config.js.srcFiles)
      .pipe(gulpEslint({fix: true}))
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError())
      .pipe(gulp.dest(config.js.outDir));
  taskJSLintFix.displayName = "js:lint:fix";
  taskJSLintFix.description = "Task to fix js lint.";
  gulp.task(taskJSLintFix);


  // MAIN TASKS
  // ==========

  // Task: watch
  const taskWatch = () => {
    gulp.watch(config.sass.srcFiles, gulp.series(taskSassLint, taskSass));
    gulp.watch(config.js.srcFiles, gulp.series(taskJSLint, taskJS));
  };
  taskWatch.displayName = "watch";
  taskWatch.description = "Task to set up watchers for files in '/src'.";
  gulp.task(taskWatch);

  // Task: build
  const taskBuild = gulp.parallel(taskSass, taskJS);
  taskBuild.displayName = "build";
  taskBuild.description = "Task to generate/compile sass and js files from '/src'.";
  gulp.task(taskBuild);

  // Task: default
  const taskDefault = taskBuild;
  taskDefault.displayName = "default";
  taskDefault.description = "Task to generate/compile sass and js files from '/src'.";
  gulp.task(taskDefault);

};

