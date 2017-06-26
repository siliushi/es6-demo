/**
 * @type {String}
 */
var gulp = require("gulp"),
  clean = require("gulp-clean"),
  less = require("gulp-less"),
  cssmin = require("gulp-cssmin"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  header = require("gulp-header"),
  rename = require('gulp-rename'),
  livereload = require('gulp-livereload'),
  watch = require('gulp-watch'),
  gutil = require('gulp-util'),
  moment = require("moment"),
  banner = '/*! <%= pkg %>,<%= moment().format("YYYY-MM-DD HH:mm:ss") %> */\r\n',
  babel = require("gulp-babel"),    // 用于ES6转化ES5;
  browserify = require('gulp-browserify'),
  gulpsync = require('gulp-sync')(gulp),
  plumber = require('gulp-plumber');

/**
 * 在文件头部添加时间戳等信息
 */
var addHeader = function() {
  return header(banner, {
    pkg: "es6",
    moment: moment
  });
};

/**
 * 先清除老的CSS和JS压缩文件
 */
gulp.task("cleanCss", function(){
  return gulp.src('css', {read: false}).pipe(clean());
});
gulp.task("cleanJs", function(){
  return gulp.src('js', {read: false}).pipe(clean());
});

gulp.task("less", ["cleanCss"], function() {
  return gulp.src('less/**/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(cssmin())
    .pipe(addHeader())
    .pipe(gulp.dest('css'));
});


// 编译
gulp.task('compile', ["cleanJs"], function() {
  return gulp.src(['jsdev/**/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('js'));
});

// 编译require
gulp.task('js', ['compile'], function() {
  return gulp.src('js/**/*.js')
    .pipe(browserify({ transform: ['babelify'] }))
    .pipe(gulp.dest('js'));
});



gulp.task("jsmin", ["js"], function() {

  gulp.src('js/**/*.js', {
    base: 'js'
  })
    .pipe(uglify({
      mangle: true
    }))
    .on('error', function(err) {
        gutil.log('message: ', err.message);
        gutil.log('fileName: ', err.fileName);
        gutil.log('lineNumber: ', err.lineNumber);
        gutil.log('plugin: ', err.plugin);
        this.end();
    })
    .pipe(addHeader())
    .pipe(gulp.dest('js'));

});

// 定义监听任务
gulp.task('watch', function () {
  gulp.watch(['./jsdev/**/*.es6'], gulpsync.sync(['js']));
  gulp.watch(['./less/**/*.less'], gulpsync.sync(['less']));
});

gulp.task("default", ["less", "jsmin"]);

// 提供给fraid调用的任务
gulp.task("build", ["less", "jsmin"]);
