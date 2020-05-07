# Turbo-Potato

## Description
- Gulp based tool for frontend assets management like sass/js compiling, minifying, linting, etc. Read more below.
- [Npm](https://www.npmjs.com/package/turbo-potato)


## Featured gulp tasks
```
├── sass           Task to compile sass files.
├── sass:lint      Task to lint sass files.
├── sass:lint:fix  Task to fix sass lint.
├── js             Task to compile js files.
├── js:lint        Task to lint js files.
├── js:lint:fix    Task to fix js lint.
├── watch          Task to set up watchers for files in '/src'.
├─┬ build          Task to generate/compile sass and js files from '/src'.
│ └─┬ <parallel>
│   ├── sass
│   └── js
└─┬ default        Task to generate/compile sass and js files from '/src'.
  └─┬ <parallel>
    ├── sass
    └── js
```


## Embedded features/modules
- SASS:
    - `sourcemaps`
    - `postcss` w/ plugins: `cssnano` `autoprefixer` `browserslist` 
    - `stylelint` w/ config: `stylelint-config-twbs-bootstrap/scss`

- JavaScript:
    - `babel` w/ config: `@babel/preset-env` 
    - `eslint` w/ config: `eslint-config-airbnb-base`
    - `uglify`
   

## Setup/Usage
```
// installation (terminal/command-line)

npm i gulp turbo-potato
```

```
// into your gulpfile.js

const gulp = require('gulp');
require('turbo-potato')(gulp);
...
```

```
// into your package.json

...
"dependencies": {
  "gulp": "^4.0.2",
  "turbo-potato": "^1.0.0",
  ...
},
"eslintConfig": {
  "extends": "airbnb-base"
},
"browserslist": [
  "defaults"
],
"stylelint": {
  "extends": "stylelint-config-twbs-bootstrap/scss"
},
...
```


## Supported file structure

```
// source (input)
├─┬ src
│ ├── js
│ └── scss


// destination (output - created automatically)
├─┬ dist
│ ├── css
│ └── js
```


## Basic configurations (recommended)

The package comes with a set of standard configurations out of the box, but it is fully customizable.

Configuration can be altered/extended in your `package.json` by populating the following keys (For options, see their respective official documentation.):
  -  `"eslintConfig"` - [Configuration options](https://eslint.org/docs/user-guide/configuring)
  -  `"stylelint"` - [Configuration options](https://stylelint.io/user-guide/configure)
  -  `"browserslist"` - (This provides config for `@babel/preset-env` and `autoprefixer`.) [Configuration options](https://github.com/browserslist/browserslist)

## Advanced configurations (use with care)

Optionally you can create a `.turbo-potatorc` file(JSON schema) and place it in to your project root.
This config file provides more altering/extending options on the default config values.

```
// Default configs. 
// Your instance would be merged with this.
{
  "styles": {
    "srcFiles": [
      "./src/scss/**/*.scss",
      "./src/scss/**/*.css"
    ],
    "srcDir": "./src/scss",
    "distDir": "./dist/css"
  },
  "scripts": {
    "srcFiles": [
      "./src/js/**/*.js"
    ],
    "srcDir": "./src/js",
    "distDir": "./dist/js"
  },
  "gulpSass": {
    "outputStyle": "expanded"
  },
  "gulpBabel": {
    "presets": [
      "@babel/env"
    ]
  },
  "gulpUglify": {},
  "autoprefixer": {
    "grid": "autoplace",
    "remove": false
  },
  "cssnano": {
    "presets": [
      "default"
    ]
  }
}

```


## Additional configs for drupal projects
```
// package.json
...
"eslintConfig": {
  ...
  "extends": "airbnb-base"
  "globals": {
    "Drupal": true,
    "drupalSettings": true,
    "jQuery": true
  },
  "rules": {
    "no-param-reassign": [
      "error",
      {
        "props": true,
        "ignorePropertyModificationsFor": [
          "Drupal"
        ]
      }
    ]
  },
  ...
},
...
```
