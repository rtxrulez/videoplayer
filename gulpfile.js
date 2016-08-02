var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var browserSync = require('browser-sync').create();
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

// обработка jade
gulp.task('templates', function() {
  var data = require('./assets/templates/data/data.json');
  gulp.src('./assets/templates/*.jade')
  .pipe(jade({
    locals: data
  }))
  .pipe(gulp.dest('./build/'))
  .pipe(browserSync.stream()); // перезагрузка сервера
});

// Обработка scss
gulp.task('sass', function () {
  var processors = [
    autoprefixer({browsers: ['last 3 version']}),
    cssnano(),
  ];
  return gulp.src('./assets/scss/**/app.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(postcss(processors))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream()); // перезагрузка сервера
});

// Обработка скриптов
gulp.task('scripts', function() {
  gulp.src(['./assets/vendor/jquery/dist/jquery.js', './assets/js/**/*.js'])
    // .pipe(browserify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream()); // перезагрузка сервера
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(['./assets/fonts/*',
                    './assets/vendor/font-awesome-sass/assets/fonts/font-awesome'])
            .pipe(gulp.dest('./build/fonts/'));
});

// Спрайты картинок
gulp.task("sprite", function() {
    var spriteData = gulp.src('./assets/img/sprite/*')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            imgPath: '/img/sprite.png',
            padding: 30,
            cssVarMap: function(sprite) {
                sprite.name = 'icon_' + sprite.name;
            }
        }));
    spriteData.img.pipe(gulp.dest('./build/img/'));
    spriteData.css.pipe(gulp.dest('./assets/scss/'));
});

// Картинки
gulp.task('images', function () {
    return gulp.src(['./assets/img/**/*'])
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
});

// Сервер
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./build"
    });
    gulp.watch("./assets/js/**/*.js", ['scripts']);
    gulp.watch("./assets/scss/**/*.scss", ['sass']);
    gulp.watch('./assets/templates/**/*.jade', ['templates'])
    gulp.watch('./assets/img/**/*', ['images', 'sprite'])
});

// задачи по умолчанию
gulp.task('default', ['sass', 'templates', 'scripts', 'fonts', 'images', 'sprite']);
