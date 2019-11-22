const gulp = require('gulp');
// ES6 JS/JSX Lineter -- Check for syntax errors
const eslint = require('gulp-eslint');
// Test Framework
const mocha = require('gulp-mocha');
// Prettifying
const prettier = require('gulp-prettier');
// Documentation Generation
const jsdoc = require('gulp-jsdoc3');

const config = require('./build.config');
const prettyConf = require('./.prettierrc.json');

const devFolder = config.devFolder;
const testFolder = config.testFolder;
const docsFolder = config.docsFolder;

const allJSFiles = [
  '*.js',
  `${testFolder}/**/*.js`,
  `${testFolder}/*.js`,
  `${devFolder}/**/*.js`,
  `${devFolder}/*.js`
];

const esLintOpts = { configFile: '.eslintrc.json', fix: true };

// Lint JS Files
gulp.task('lint', () => {
  return gulp
    .src(allJSFiles)
    .pipe(eslint({ configFile: '.eslintrc.json' }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', gulp.series('lint'), () => {
  return gulp
    .src('test.js', { read: false })
    .pipe(mocha())
    .once('error', () => {
      process.exit(1);
    });
});

gulp.task('fix', () => {
  return gulp
    .src(allJSFiles)
    .pipe(eslint(esLintOpts))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest((file) => {
      return file.base;
    }));
});

gulp.task('pretty', () => {
  return gulp
    .src(allJSFiles)
    .pipe(prettier(prettyConf))
    .pipe(eslint(esLintOpts))
    .pipe(gulp.dest((file) => {
      return file.base;
    }));
});

gulp.task('docs', (done) => {
  gulp
    .src(['README.md', `./${devFolder}**/*.js`, `./${config.main}`], { read: false })
    .pipe(jsdoc({ opts: { destination: docsFolder } }, done));
});

gulp.task('default', gulp.series('test'));
