module.exports = (gulp, $, config)->
  gulp.task 'sass', ->
    gulp.src 'src/css/**/*.+(sass|scss)'
    .pipe $.sourcemaps.init
      loadMaps: true
    .pipe $.sass
      indentedSyntax: true
      outputStyle: 'compressed'
    .on 'error', (error) ->
      $.logger.info error.toString()
      @emit 'end'
    .pipe $.replace(/(\.png)/g, '$1?' + (new Date()).getTime())
    .pipe $.autoprefixer ['last 2 version', 'IE 8']
    .pipe $.sourcemaps.write '.',
      includeContent: false
      sourceRoot: '.'
    .pipe gulp.dest config.paths.css
    .pipe $.filter '**/*.css'
    .pipe $.browserSync.reload stream: true
