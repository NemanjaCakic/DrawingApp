
// include gulp
var gulp = require('gulp');

// include plug-ins
var concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    minifyHTML = require('gulp-minify-html'),
    //imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed');


// gulp.task('scripts', function() {
//   gulp.src(['./js/jquery.js','./js/*.js'])
//     .pipe(concat('script.js'))
//     .pipe(plumber())
//     .pipe(uglify())
//     .pipe(gulp.dest('./js/min/'));
// });

gulp.task('scripts', function() {
  gulp.src(['./src/js/colorPicker.js','./src/js/main.js'])
    .pipe(concat('./main.js'))
    .pipe(plumber())
    .pipe(gulp.dest('./build/'))
    .pipe(livereload());
});


gulp.task('styles', function () {
  gulp.src('./src/scss/style.scss')
  .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefix("last 2 version", "> 1%", "ie 8", { cascade: true }))
    .pipe(gulp.dest('./build/'))
    .pipe(livereload());
});

gulp.task('html', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './build';

  gulp.src(htmlSrc)
    .pipe(gulp.dest(htmlDst))
    .pipe(livereload());
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = 'src/img/*',
      imgDst = 'build/img/';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});


// default gulp task
gulp.task('default', function() {
  //livereload.listen();
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/scss/*.scss', ['styles']);
  gulp.watch('./src/js/*.js', ['scripts']);
});


// TODO
// points, card number (easy, medium, hard) , moves