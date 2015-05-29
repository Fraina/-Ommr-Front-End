module.exports = (gulp, $, config)->
  gulp.task 'sprite', ->
    spriteData = gulp.src 'src/img/**/*.png'
    .pipe $.spritesmith
      imgName: 'sprite.png',
      cssName: '_sprite.sass'
      imgPath: '../img/sprite.png'

    spriteData.on 'error', (error) ->
      $.logger.info error.toString()
      @emit 'end'

    spriteData.img
      .pipe gulp.dest config.paths.img

    spriteData.css
      .pipe gulp.dest 'src/css/'

    return
