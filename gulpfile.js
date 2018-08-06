// 加入套件
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var mainBowerFiles = require('main-bower-files');
var minimist = require('minimist');
var gulpSequence = require('gulp-sequence');

// 設定環境為開發或是發布
var envOptions = {
  string: 'env',
  default: { env: 'develop' }
};
var options = minimist(process.argv.slice(2), envOptions);
console.log(options);

// 設定clean
gulp.task('clean', function () {
  return gulp.src(['./.tmp', './public'], {read: false})
    .pipe($.clean());
});

// jade編譯
gulp.task('jade', function () {
  gulp.src('./source/**/*.jade')
    .pipe($.plumber()) // plumber套件>遇到錯誤繼續編譯
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest('./public/'));
});

// sass編譯
gulp.task('sass', function () {
  // 增加postcss與autoprefixer套件
  var plugins = [
    autoprefixer({browsers: ['last 3 version', '> 5%', 'ie 8']})
  ];
  return gulp.src('./source/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(plugins)) // 引用postacss套件>CSS前輟詞
    .pipe($.if(options.env === 'production', $.cleanCss()))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'));
});
// concat(合併),sourcemaps(顯示來源),babel(套用ES6語言)套件
gulp.task('babel', () =>
  gulp.src('./source/js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['env']
    }))
    .pipe($.concat('all.js'))
    .pipe($.if(options.env === 'production', $.uglify({
      compress: {
        drop_console: true
      }
    })))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js'))
);
// bower套件管理
gulp.task('bower', function () {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./.tmp/vendors'));
});
gulp.task('vendorsJs', ['bower'], function () {
  return gulp.src('./.tmp/vendors/**/**.js')
    .pipe($.concat('vendors.js'))
    .pipe($.if(options.env === 'production', $.uglify()))
    .pipe(gulp.dest('./public/js'));
});

// 壓縮圖片
gulp.task('image-min', () =>
  gulp.src('./source/images/*')
    .pipe($.if(options.env === 'production', $.imagemin()))
    .pipe(gulp.dest('./public/images'))
);

// 監控
gulp.task('watch', function () {
  gulp.watch('./source/scss/**/*.scss', ['sass']);
  gulp.watch('./source/**/*.jade', ['jade']);
  gulp.watch('./source/js/**/*.js', ['babel']);
});

// 連結github 輸入gulp deploy即可上傳
gulp.task('deploy', function () {
  return gulp.src('./public/**/*')
    .pipe($.ghPages());
});

// 最後要交付前clean後全部重跑一次
gulp.task('build', gulpSequence('clean', 'jade', 'sass', 'babel', 'vendorsJs', 'image-min'));

// 預設輸入gulp編譯以下套件
gulp.task('default', ['jade', 'sass', 'babel', 'vendorsJs', 'image-min', 'watch']);
