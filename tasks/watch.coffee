module.exports = (gulp, $, config)->
  gulp.task 'watch', ->
    $.watch ['src/**'], (vinyl) ->
      $.logger.info 'File {cyan:' + vinyl.path + '} was {red:' + vinyl.event + '}, running tasks...'
      return gulp.start 'remarkable' if vinyl.path.match /\.md$/
      return gulp.start 'jade' if vinyl.path.match /\.jade$/
      return gulp.start 'stylus' if vinyl.path.match /\.styl/
      return gulp.start 'sass' if vinyl.path.match /(\.sass|\.scss)$/
      return gulp.start 'coffee' if vinyl.path.match /\.coffee$/
      return gulp.start 'bower' if vinyl.path.match /bower_components/
      gulp.start 'src'

    if config.mock
      gulp.watch config.mock, ->
        config.restartServer = true
        gulp.start 'serve'
    return
