'use strict'
Mock = require('mockjs')
router = require('express').Router()
router.get '/user/:id', (req, res) ->
  res.json req.params
  return

router.get '/hello', (req, res) ->
  res.json name: 'Lance'
  return

router.get '/data', (req, res) ->
  random = Mock.Random
  data =
    boolean: random.boolean()
    integer: random.integer(1, 9527)
    float: random.float(1, 200, 0, 99)
    string: random.string(7, 10)
    range: random.range(1, 78, 5)
  res.json data
  return

module.exports = router
