/* File: gulpfile.js */

// grab our gulp packages
var gulp   = require('gulp'),
    jshint = require('gulp-jshint');
    usemin = require('gulp-usemin');
    gp_concat = require('gulp-concat');
    rename = require('gulp-rename');
    uglify = require('gulp-uglify');
    minifyHtml = require('gulp-minify-html');
    minifyCss = require('gulp-minify-css');
    rev = require('gulp-rev');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('optimizejs', function(){
    return gulp.src(['src/**/*.js'])
        .pipe(gp_concat('concat.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(rename('optimized.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('usemin', function() {
  return gulp.src('src/*.html')
    .pipe(usemin({
      css: [ rev() ],
      html: [ minifyHtml({ empty: true }) ],
      js: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinecss: [ minifyCss(), 'concat' ]
    }))
    .pipe(gulp.dest('dist/'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['jshint']);
});