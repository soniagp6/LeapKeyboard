var gulp = require('gulp');
// LiveReload
var connect = require('gulp-connect');
// ES6
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
// JS
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
// CSS
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
// UTILS
var sequence = require('run-sequence');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
var del = require('del');

// Compile Sass .sass files into css
gulp.task('compile-sass', function() {
  return gulp.src('./src/css/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./src/css'));
});

// Compile ES6 modules into app.js file
gulp.task('compile-es6', ['lint'], function () {
  return browserify({
    // Only need initial file, browserify finds the deps
    entries: './src/js/es6/main.js',
    extensions: ['.js', '.jsx'],
    debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./src/js'));
});

// Lint js code using eslint
gulp.task('lint', function () {
  return gulp.src(['./src/js/es6/*.js'])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});

// Setup servers and live reload
gulp.task('connect-dev', function () {
    connect.server({
        root: 'src',
        port: 9000,
        livereload: true
    });
});

gulp.task('connect-prod', function () {
    connect.server({
        root: 'dist',
        port: 9001,
        livereload: true
    });
});

// LiveReload on changes to html files
gulp.task('html', function () {
  gulp.src('./src/*.html')
    .pipe(connect.reload());
});

// LiveReload on changes to main.css file
gulp.task('css', function () {
  gulp.src('./src/css/main.css')
    .pipe(connect.reload());
});

// LiveReload on changes to app.js file
gulp.task('js', function () {
  gulp.src('./src/js/app.js')
    .pipe(connect.reload());
});

// Watch for changes to HTML, CSS, JS
gulp.task('watch', function () {
  // Live reload browser when hmtl, css, or js change
  gulp.watch(['./src/*.html'], ['html']);
  gulp.watch(['./src/css/main.css'], ['css']);
  gulp.watch(['./src/js/app.js'], ['js']);
  // Compile sass when sass file change - updates main.css
  gulp.watch(['./src/css/sass/**/*.sass'], ['compile-sass']);
  // Compile app.js file file when es6 files change
  gulp.watch(['./src/js/es6/**/*.js'], ['compile-es6']);
});

gulp.task('minify-js', function() {
  return gulp.src('./src/js/app.js')
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('minify-css', ['compile-sass'], function() {
  return gulp.src('./src/css/main.css')
    .pipe(rename('main.min.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-index', function() {
  return gulp.src('./src/index.html')
    .pipe(htmlreplace({
        'css': 'css/main.min.css',
        'js': 'js/app.min.js'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
  return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('copy-fonts', function() {
  return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
});

// Delete all files from `dist` folder
gulp.task('clean:dist', function (cb) {
  del([
    './dist/**/*.html',
    './dist/css/**/*',
    './dist/js/**/*',
    './dist/images/**/*',
    './dist/fonts/**/*',
    // if you don't want to clean a file, negate the pattern
    //'!dist/js/data.json'
  ], cb);
});

gulp.task('default', ['connect-dev', 'compile-es6', 'compile-sass', 'watch']);

gulp.task('dev', ['default']);

gulp.task('prod', function () {
  sequence('clean:dist', ['copy-index', 'minify-css', 'copy-images', 'copy-fonts'],
    'compile-es6', 'minify-js', 'connect-prod');
});

gulp.task('dist', function () {
  sequence('clean:dist', ['copy-index', 'minify-css', 'copy-images', 'copy-fonts'],
    'compile-es6', 'minify-js');
});