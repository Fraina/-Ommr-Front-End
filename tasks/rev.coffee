module.exports = (gulp, $, config)->
  gulp.task 'rev', ->
    gulp.src [config.paths.build + '**/*.html', '!' + config.paths.build + 'bower/**', '!' + config.paths.build + 'js/**']
    .pipe $.rev 'cwd': config.paths.build
    .pipe gulp.dest config.paths.build
