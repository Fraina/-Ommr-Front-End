'use strict'

gulp = require 'gulp'
gutil = require 'gulp-util'
requireDir = require 'require-dir'
_ = require 'lodash'
$ = require('gulp-load-plugins')(
  camelize: true
  lazy: true
  rename:
    'gulp-gh-pages': 'ghPages'
    'gulp-bower-src': 'bowerSrc'
    'gulp-rev-mtime': 'rev'
)
$.runSequence = require('run-sequence').use(gulp)
$.browserSync = require 'browser-sync'
$.logger = require('eazy-logger').Logger(
  prefix: '[{blue:Laima}] '
  useLevelPrefixes: false
)

config = require './config'
config.buildPath = 'build/'
config.port = if gutil.env.port then gutil.env.port else 4000
config.mock = if gutil.env.mock then gutil.env.mock else false
config.open = if gutil.env.open then gutil.env.open else false
config.isBuild = if _.first(gutil.env._) == 'build' then true else false
config.restartServer = false
config.BSIsReady = false
config.devServer = {}
config.paths =
  css: config.buildPath + 'css/'
  js: config.buildPath + 'js/'
  img: config.buildPath + 'img/'
  font: config.buildPath + 'font/'
  build: config.buildPath

process.on 'uncaughtException', (err) ->
  $.logger.info '{red:Caught exception:} ' + err
  return

for name, task of requireDir('tasks')
  task(gulp, $, config)
