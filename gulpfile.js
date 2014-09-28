var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');

var paths = {
    scripts: ['assets/js/app.js', 
    		'assets/js/routes/**/*.js',
		    'assets/js/controllers/**/*.js', 
		    'assets/js/directives/**/*.js', 
		    'assets/js/filters/**/*.js', 
		    'assets/js/services/**/*.js'],
	styles: ['assets/css/less/**/*.less']
};

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function() {
	return gulp.src(paths.styles)
		.pipe(less())
		.pipe(gulp.dest('dist/css'));
})

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'styles']); 
