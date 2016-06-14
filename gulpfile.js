var gulp       = require('gulp');
var sass       = require('gulp-sass');
var clean_css  = require('gulp-clean-css');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');
var browserify = require('gulp-browserify');


/* SASS -> Minified CSS */
gulp.task('sass', function() {
	return gulp.src('app/scss/main.scss')
	      .pipe(sass())
          .pipe(clean_css())
	      .pipe(gulp.dest('./app/dist/css'));
});


/* Bundle Vendor JavaScript */
gulp.task('bundle-vendor-js', function() {
	return gulp.src('./app/js/vendor.js')
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/js'));
});


/* Bundle JavaScript */
gulp.task('bundle-js', function() {
	return gulp.src(['./app/js/*.js', '!./app/js/vendor.js'])
	    .pipe(concat('main.js'))
	    .pipe(gulp.dest('./app/dist/js'))
	    .pipe(uglify())
	    .pipe(gulp.dest('./app/dist/js'));
});