/**
 * @File
 * Gulp powered frontend tools.
 */

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
 * User available configs.
 */
const defaultConfig = {
  styles: {
    srcFiles: ["./src/scss/**/*.scss", "./src/scss/**/*.css"],
    srcDir: "./src/scss",
    distDir: "./dist/css"
  },
  scripts: {
    srcFiles: ["./src/js/**/*.js"],
    srcDir: "./src/js",
    distDir: "./dist/js"
  },
  gulpSass: {
    outputStyle: "expanded"
  },
  gulpBabel: {
    presets: ["@babel/env"]
  },
  gulpUglify: {},
  autoprefixer: {
    grid: "autoplace",
    remove: false
  },
  cssnano: {
    presets: ["default"]
  }
};

const config = require("rc")("turbo-potato", defaultConfig);

/**
 * Non user available configs.
 */
const _localConfig = {
  gulpEslint: {},
  gulpEslintFix: {
    fix: true
  },
  gulpStylelint: {
    reporters: [{ formatter: "string", console: true }]
  },
  gulpStylelintFix: {
    reporters: [{ formatter: "string", console: true }],
    fix: true
  },
};

/**
 * Plugin sets provider.
 */
const plugins = {
  gulpPostcss: [
    autoprefixer(config.autoprefixer),
    cssnano(config.cssnano),
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
    gulp.src(config.styles.srcFiles)
      .pipe(gulpSourcemaps.init())
      .pipe(gulpSass(config.gulpSass))
      .pipe(gulpPostcss(plugins.gulpPostcss))
      .pipe(gulpRename({ suffix: ".min" }))
      .pipe(gulpSourcemaps.write("./"))
      .pipe(gulp.dest(config.styles.distDir));
  taskSass.displayName = "sass";
  taskSass.description = "Task to compile sass files.";
  gulp.task(taskSass);

  // Task: stylelint
  const taskSassLint = () =>
    gulp.src(config.styles.srcFiles)
      .pipe(gulpStylelint(_localConfig.gulpStylelint));
  taskSassLint.displayName = "sass:lint";
  taskSassLint.description = "Task to lint sass files.";
  gulp.task(taskSassLint);

  // Task: stylelint fix
  const taskSassLintFix = () =>
    gulp.src(config.styles.srcFiles)
      .pipe(gulpStylelint(_localConfig.gulpStylelintFix))
      .pipe(gulp.dest(config.styles.srcDir));
  taskSassLintFix.displayName = "sass:lint:fix";
  taskSassLintFix.description = "Task to fix sass lint.";
  gulp.task(taskSassLintFix);

  // JavaScript TASKS
  // ================

  // Task: babel, uglify
  const taskJS = () =>
    gulp.src(config.scripts.srcFiles)
      .pipe(gulpBabel(config.gulpBabel))
      .pipe(gulpUglify(config.gulpUglify))
      .pipe(gulpRename({suffix: ".min"}))
      .pipe(gulp.dest(config.scripts.distDir));
  taskJS.displayName = "js";
  taskJS.description = "Task to compile js files.";
  gulp.task(taskJS);

  // Task: eslint (options: /.eslintrc)
  const taskJSLint = () =>
    gulp.src(config.scripts.srcFiles)
      .pipe(gulpEslint(_localConfig.gulpEslint))
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError());
  taskJSLint.displayName = "js:lint";
  taskJSLint.description = "Task to lint js files.";
  gulp.task(taskJSLint);

  // Task: eslint fix
  const taskJSLintFix = () =>
    gulp.src(config.scripts.srcFiles)
      .pipe(gulpEslint(_localConfig.gulpEslintFix))
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError())
      .pipe(gulp.dest(config.scripts.srcDir));
  taskJSLintFix.displayName = "js:lint:fix";
  taskJSLintFix.description = "Task to fix js lint.";
  gulp.task(taskJSLintFix);

  // CI friendly task namings.
  const taskLintCI = gulp.parallel(taskSassLint, taskJSLint);
  taskLintCI.displayName = "lint";
  taskLintCI.description = "Task to lint sass and js files";
  gulp.task(taskLintCI);

  const taskSassLintCI = () => taskSassLint();
  taskSassLintCI.displayName = "lint:sass";
  taskSassLintCI.description = "Task to lint sass files";
  gulp.task(taskSassLintCI);

  const taskSassLintFixCI = () => taskSassLintFix();
  taskSassLintFixCI.displayName = "lint:sass:fix";
  taskSassLintFixCI.description = "Task to fix sass lint.";
  gulp.task(taskSassLintFixCI);

  const taskJSLintCI = () => taskJSLint();
  taskJSLintCI.displayName = "lint:js";
  taskJSLintCI.description = "Task to lint js files.";
  gulp.task(taskJSLintCI);

  const taskJSLintFixCI = () => taskJSLintFix();
  taskJSLintFixCI.displayName = "lint:js:fix";
  taskJSLintFixCI.description = "Task to fix js lint.";
  gulp.task(taskJSLintFixCI);

  // MAIN TASKS
  // ==========

  // Task: watch
  const taskWatch = () => {
    gulp.watch(config.styles.srcFiles, { ignoreInitial: false }, gulp.parallel(taskSassLint, taskSass));
    gulp.watch(config.scripts.srcFiles, { ignoreInitial: false }, gulp.parallel(taskJSLint, taskJS));
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

