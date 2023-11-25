# vue-the-aviator

<img src=WX20231125-232209.png>

Demo: https://we-fun.github.io/vue-the-aviator/

> A Vue.js version of the Aviator:
- https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
- https://tympanus.net/Tutorials/TheAviator/

## Heads up!

1. If you were npm-linking `vue-threejs`, don't forget to link `three`, so there won't be confusing stuffs happened (instanceof not working, threejs-inspector [went into a debugger](https://github.com/jeromeetienne/threejs-inspector/issues/26), etc). `vue-threejs` should try to handle it as well.

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
