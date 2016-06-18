var gulp = require('gulp'),
	sass = require('gulp-sass'),
	babel = require('gulp-babel'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect');

gulp.task('styles', function() {
    gulp.src('src/css/sass/**/*.scss')
        .pipe(sass({outputStyle: 'uncompressed', indentedSyntax: true}).on('error', sass.logError))
        .pipe(gulp.dest('src/css'))
        .pipe(connect.reload());
});

gulp.task('es6to5', function () {
    return gulp.src('src/js/es6/main.js')
        .pipe(babel())
        .pipe(gulp.dest('src/js'))
        .pipe(connect.reload());
});

gulp.task('watch',function() {
    gulp.watch('src/css/sass/**/*.scss',['styles']);
    gulp.watch('src/js/es6/components/*.js',['es6to5']);
});

// Setup servers and live reload
gulp.task('connect-dev', function () {
    connect.server({
        root: '',
        port: 9000,
        livereload: true
    });
});

gulp.task('default', ['connect-dev', 'styles', 'watch']);