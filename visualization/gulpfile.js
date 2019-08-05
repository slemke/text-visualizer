const { src, dest, parallel, watch } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const babel = require('gulp-babel');

const jsFiles = [
	'assets/js/index.js',
	'assets/js/sunburst.js',
	'assets/js/text.js'
];

const cssFiles = [
	'assets/css/index.css',
	'assets/css/sunburst.css'
];

const css = () => {
	return src(cssFiles)
		.pipe(concat('index.min.css'))
		.pipe(cleanCSS())
		.pipe(dest('assets/css'));
};

const js = () => {
	return src(jsFiles)
			.pipe(concat('index.min.js'))
			.pipe(babel())
			.pipe(minify({
				ext: {
					min: '.js'
				},
				noSource: true,
				ignoreFiles: ['-min.js', '.min.js']
			}))
			.pipe(dest('assets/js'));
};

const watchFiles = () => {
	watch(paths.css, ['css']).on('change', (event) => {
		console.log('File ' + event.path + ' was ' + event.type);
	});

	watch(paths.scripts, ['js']).on('change', (event) => {
		console.log('File ' + event.path + ' was ' + event.type);
	});
}

exports.watch = watchFiles;
exports.default = parallel(css, js);
