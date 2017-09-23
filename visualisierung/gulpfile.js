"use strict";

var paths = {
	scripts: [
		'assets/js/lib/**/*.js',
		'assets/js/frontend/*.js',
		'assets/js/index.js'
	],
	css: [
		'assets/css/index.css',
		'assets/css/sunburst.css'
	]
};

const gulp = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');

gulp.task('default', ['css', 'js'], function() {
	// remove unneeded files
});

gulp.task('js', function() {
	return gulp.src(paths.scripts)
	.pipe(concat('index.min.js'))
	.pipe(gulp.dest('assets/js/'));
});

gulp.task('css', function() {
	return gulp.src(paths.css)
		.pipe(concat('index.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('assets/css'));
});


gulp.task('watch', ['default'], function() {


	var css_watcher = gulp.watch(paths.css, ['css'])

	var js_watcher = gulp.watch(paths.scripts, ['js']);

	css_watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type);
	});

	js_watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type);
	});
});
