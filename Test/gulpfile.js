/*eslint-env node */
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
//var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var jasmineBrowser = require('gulp-jasmine-browser');


gulp.task('styles',function(){
	return gulp
		.src('sass/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers:['last 2 versions']
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('lint', function(){
	return gulp
		.src('js/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('tests', function() {
	return gulp
		.src('tests/spec/extraSpec.js')
		.pipe(jasmineBrowser.specRunner({ console: true }))
		.pipe(jasmineBrowser.headless({ driver: 'chrome' }));
	// .pipe(jasmine({
	// 	integration: true
	// }));
});

gulp.task('copy-html', function(){
	return gulp
		.src('./index.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function(){
	return gulp
		.src('./img/*')
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('script' , function(){
	return gulp
		.src('./js/**/*.js')
		.pepe(babel())
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('script-dist' , function(){
	return gulp
		.src('./js/**/*.js')
		.pipe(babel())
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('dist', gulp.series('copy-html',
	'copy-images',
	'styles',
	'lint',
	'script-dist'
));

gulp.task('default', gulp.parallel('copy-html','copy-images','styles','lint',function(done){
	gulp.watch('sass/**/*.scss',gulp.parallel('styles'));
	gulp.watch('js/**/*.js',gulp.parallel('lint'));
	gulp.watch('./index.html', gulp.parallel('copy-html'));
	gulp.watch('.dist/index.html').on('change', browserSync.reload);
	browserSync.init({
		server: './dist'
	});

	done();
}));
