module.exports = (gulp, $, config)->
  gulp.task 'deploy', ->
    gulp.src config.paths.build + '**/*'
    .pipe $.ghPages(config.deploy)
