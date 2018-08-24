var gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), // Подключаем Sass пакет
    livereload = require('gulp-livereload'); // Подключаем пакет LiveReload

livereload({ start: true });

// Папки для отслеживания изменений Livereload'ом
var directories = ["./*.html", "js/*.js", "css/*.css"]; 


gulp.task('sass', function() { 
  return gulp.src(['sass/**/*.sass', 'sass/**/*.scss']) // Берем источник
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(gulp.dest('css')); // Выгружаем результата в папку css
  });

gulp.task('watch', [], function() {
	livereload.listen();

	// Наблюдение за sass файлами в папке sass
  	gulp.watch(['sass/**/*.sass', 'sass/**/*.scss'], ['sass']); 
  	
  	// Livereload
  	gulp.watch(directories, function(){
  		gulp.src(directories).pipe(livereload());
  	});
});

gulp.task('default', ['watch']);

