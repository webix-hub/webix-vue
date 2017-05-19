<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <webix-combo label="Category" :options='data' />
    <webix-ui :config='ui' />
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    var users = [
      { id: 1, value: 'Alex Brown', age: 32 },
      { id: 2, value: 'Dan Simons', age: 41 }
    ]

    return {
      msg: 'Welcome to Your Vue.js App',
      ui: {
        type: 'space',
        cols: [{
          view: 'calendar'
        }, {
          view: 'datatable',
          autoConfig: true,
          select: true,
          data: users
        }]
      },
      data: users
    }
  }
}
</script>
