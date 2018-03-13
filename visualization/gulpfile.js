'use strict';

var paths = {
	scripts: [
		'assets/js/index.js',
		'assets/js/sunburst.js',
		'assets/js/text.js'
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
const babel = require('gulp-babel');

gulp.task('default', ['css', 'js'], () => {
	// run default task
});

gulp.task('js', () => {
	return gulp.src(paths.scripts)
		.pipe(concat('index.min.js'))
		.pipe(babel())
		//.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest('assets/js/'));
});

gulp.task('css', () => {
	return gulp.src(paths.css)
		.pipe(concat('index.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('assets/css'));
});

gulp.task('watch', ['default'], () => {

	gulp.watch(paths.css, ['css']).on('change', (event) => {
		console.log('File ' + event.path + ' was ' + event.type);
	});

	gulp.watch(paths.scripts, ['js']).on('change', (event) => {
		console.log('File ' + event.path + ' was ' + event.type);
	});
});
