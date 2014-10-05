var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var karma = require('karma').server;

var paths = {
    scripts: ['assets/js/app.js', 
    		'assets/js/routes/**/*.js',
		    'assets/js/controllers/**/*.js', 
		    'assets/js/directives/**/*.js', 
		    'assets/js/filters/**/*.js', 
		    'assets/js/services/**/*.js'],
	styles: ['assets/css/less/**/*.less']
};

/**
 * Concatenates js source files
 */
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
});

/**
 * Compiles less sources
 */
gulp.task('styles', function() {
	return gulp.src(paths.styles)
		.pipe(less())
		.pipe(gulp.dest('dist/css'));
})

/**
 * Runs test once and exit
 */
gulp.task('karma-test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'styles']); 
gulp.task('test', ['default', 'karma-test']);
