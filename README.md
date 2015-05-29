# Laima

A suite of Front-End Tool to develop, showcase, and mock API,
powered by gulp.

I'd **strongly recommend** that you use <https://github.com/IEMustDie/slush-laima> to generate new projects.

## Requirement

 - Ruby Compass (If you need)

## Install

```bash
npm install
```

## Development

```bash
# default url
http://localhost:4000
```

## Commands

### Run

```bash
gulp
gulp --open local
gulp --port 9527
gulp --mock ./server.coffee
```

#### Flags
 - `--open <string>` open browser. `[local, external, tunnel]`
 - `--port <number>` set port.
 - `--mock <path/to/file>` set mock.

#### Mock Example
See `./server.coffee`.

### Build

```bash
gulp build
```

### Clean

```bash
gulp clean
```

### Lint

```bash
gulp lint
```

### Doc

```bash
gulp doc
```

### TODO

```bash
gulp todo
```

### Bump

If your version is `0.8.0`.

```bash
gulp bump:major # 1.0.0
gulp bump:minor # 0.9.0
gulp bump:patch # 0.8.1
gulp bump:prerelease # 0.8.1-0
gulp bump --to 1.1.1 # 1.1.1

# default: patch
gulp bump # 0.8.1
```

See <https://github.com/stevelacy/gulp-bump#versioning>.

### Minify Images

```bash
npm install --save-dev gulp-image
gulp image
```

Adjusting `tasks/image.coffee` to fit your project.

### Sprite

```bash
npm install --save-dev gulp.spritesmith
gulp sprite
```

Adjusting `tasks/sprite.coffee` to fit your project.

## Manifest

```text
bower_components/
build/
  docco/
src/
  css/
  font/
  img/
  js/
  index.jade
test/
```

- `.sass|.scss|.styl`: `css/`.
- font files: `font/`.
- image files: `img/`.
- `.js|.coffee`: `js/`.
- `.jade|.md|.html|.*`: anywhere.

## Components
 - MVCSS
   - official <http://mvcss.github.io/>
   - 正體中文文件 <http://mvcss.ycnets.com/>
 - backbone <http://backbonejs.org>
 - CoffeeScript <http://coffeescript.org>
   - CoffeeLint <http://www.coffeelint.org/>
 - ESLint <http://eslint.org/>
 - requirejs <http://requirejs.org>
   - requirejs-text <https://github.com/requirejs/text>
   - requirejs-i18n <https://github.com/requirejs/i18n>
 - jade <http://jade-lang.com/>
   - 正體中文文件 <http://jade.ycnets.com/>
 - Material-Design-ColorHelper <https://github.com/Fraina/Material-Design-ColorHelper>
 - Mock.js <http://mockjs.com/>
 - Docco <http://jashkenas.github.io/docco/>
 - mocha <http://mochajs.org/>
 - Remarkable <https://jonschlinkert.github.io/remarkable/demo/>
 - spritesmith <https://github.com/Ensighten/spritesmith>

## Config Sample

```coffeescript
module.exports =
  rjs:
    options:
      name: 'main'
      out: 'app.js'
      paths:
        jquery: '../bower/jquery/dist/jquery.min'
        underscore: '../bower/underscore/underscore-min'
        backbone: '../bower/backbone/backbone'
        i18n: '../bower/requirejs-i18n/i18n'
        text: '../bower/requirejs-text/text'
        backstretch: '../bower/jquery-backstretch/jquery.backstretch.min'
  docco:
    layout: 'linear'
  remarkable:
    remarkableOptions:
      html: true
  deploy:
    cacheDir: '.cache'
```
### Jade options

<http://jade-lang.com/api/>

### Remarkable options

<https://github.com/jonschlinkert/remarkable#options>

### Docco options

<http://jashkenas.github.io/docco/#configuration>

### Deploy options (for Github pages)

<https://github.com/rowoot/gulp-gh-pages#deployoptions>

## Deployment

### Github pages

```bash
gulp build
gulp deploy
```

## About TODO

### Supported Filetypes

See <https://github.com/pgilad/leasot#supported-languages>.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
