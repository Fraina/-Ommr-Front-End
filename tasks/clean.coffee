module.exports = (gulp, $, config)->
  del = require 'del'
  gulp.task 'clean', ->
    del.sync config.paths.build
    return
