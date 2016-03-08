var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
    gulp.src('src/css/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed', indentedSyntax: true}).on('error', sass.logError))
        .pipe(gulp.dest('src/css/css/'));
});


gulp.task('default',function() {
    gulp.watch('src/css/sass/**/*.scss',['styles']);
});