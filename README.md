# Webpack-unused-files
find unused modules in webpack projects, include files and dependencies in package.json

## Usage
1.get the stats.json files with webpack

```
$ webpack --json > stats.json
```

2.find the unused files

``` js
const findUnusedFiles = require('./src/index.js')

findUnusedFiles(options).then(files => {
  // get the files and do whatever you want
  console.log(files)
})
```

## Options

### pattern
the pattern of the files you want to check

#### default
'./src/**'

### remove
auto remove the unused files

#### default
false

