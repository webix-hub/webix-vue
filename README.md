# Webix + Vue

Demo of using Webix and Vuew, webpack version


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## How you can use Webix views

- add vue-webix through npm

```bash
npm install -s vue-webix
```

- import module and use all webix related views

```js
import 'vue-webix'
```
```html
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <webix-combo label="Category" :options='data' />
    <webix-ui :config='ui' />
  </div>
</template>
```