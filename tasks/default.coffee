module.exports = (gulp, $, config)->
  gulp.task 'default', ->
    $.runSequence 'src', ['remarkable', 'jade', 'sass', 'coffee', 'bower'], ['watch', 'serve']
