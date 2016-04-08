var gulp = require('gulp'),
	sass = require('gulp-sass'),
    browserify = require('browserify'),
	babelify = require('babelify');

gulp.task('styles', function() {
    gulp.src('src/css/sass/**/*.scss')
        .pipe(sass({outputStyle: 'uncompressed', indentedSyntax: true}).on('error', sass.logError))
        .pipe(gulp.dest('src/css'));
});

// gulp.task('es6to5', function () {
//     return gulp.src('src/js/es6/main.js')
//         .pipe(babel())
//         .pipe(gulp.dest('src/js'));
// });

gulp.task('es6to5', function () {
  return browserify({
    // Only need initial file, browserify finds the deps
    entries: 'src/js/es6/main.js',
    extensions: ['.js'],
    debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('src/js'));
});

gulp.task('default',function() {
    gulp.watch('src/css/sass/**/*.scss',['styles']);
    gulp.watch('src/js/es6/components/*.js',['es6to5']);
});

