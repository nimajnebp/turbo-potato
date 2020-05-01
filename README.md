# Turbo-Potato


### Description

- Gulp based tool for frontend assets management like sass/js compiling, minifying, linting, etc.


### Featured tasks
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


### Setup/Usage
```
// gulpfile.js

var gulp = require('gulp');
require('turbo-potato')(gulp);
```


```
// package.json

"dependencies": {
  "gulp": "^4.0.0",
  "turbo-potato": "^0.1.0",
  ...
},
```

### Supported file structure

```
// source (input)
├─┬ src
│ ├── js
│ └── scss


// destination (output)
├─┬ dist
│ ├── css
│ └── js
```
