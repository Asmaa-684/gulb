const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")



//عشان اعمل اختبار للمسافات والكومنت فى html

const htmlmin = require('gulp-htmlmin');
function minifyHTML() {
    return src('project/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'))
}

exports.html = minifyHTML


//هنا عشان اقلل فى الجافا
const concat = require('gulp-concat');
const terser = require('gulp-terser');

function jsMinify() {
    return src('project/js/**/*.js',{sourcemaps:true}) 
    
     //هنا عشان اعمل لكل الفايلات
        .pipe(concat('all.min.js'))
        
        .pipe(terser())
        
        .pipe(dest('dist/assets/js',{sourcemaps:'.'}))
}
exports.js = jsMinify


//هنا عشان اختبر الcss

var cleanCss = require('gulp-clean-css');
function cssMinify() {
    return src("project/css/**/*.css")
      
        .pipe(concat('style.min.css'))
       
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css'))
}
exports.css = cssMinify
//sass task
const sass = require('gulp-sass')(require('sass'));
function sassMinify() {
    return src(["project/sass/**/*.scss", "project/css/**/*.css"],{sourcemaps:true})
        .pipe(sass()) // هنا عشان احول من ساس ل css
       
        .pipe(concat('style.sass.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css',{sourcemaps:'.'}))
}
exports.sass = sassMinify


var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}
//series لازم اخلص اول بروسس وابدا ف التانيه 
//parallel مجرد ماابدا اول بروسس بيدخل ف التانية فبياخد وقت اقل 
//watch task
function watchTask() {
    watch('project/*.html',series(minifyHTML, reloadTask))
    watch('project/js/**/*.js',series(jsMinify, reloadTask))
    watch(["project/css/**/*.css","project/sass/**/*.scss"], series(sassMinify,reloadTask));
}
exports.default = series( parallel(imgMinify, minifyHTML), serve,watchTask)
