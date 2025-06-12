# VueJS adapter for Webix UI

[![npm version](https://badge.fury.io/js/vue-webix.svg)](https://badge.fury.io/js/vue-webix)

See the [detailed documentation on integration of Webix with VueJS](http://docs.webix.com/desktop__vue.html).

If you need a framework for using Webix UI, we highly recommend you use the [Webix Jet](https://webix.gitbook.io/webix-jet) framework for building web apps with Webix, as it is native for the library and will help you to manage the development stages in the most natural way.

## When to Use Vue+Webix integration

- to add a few complex widgets to a VueJS-based apps (such as datatable, spreadsheet, etc.)
- to use a VueJS app inside of Webix UI (reactive templates, custom forms, etc.)

You can also create a custom component by wrapping a Webix widget into a Vue component or use one of ready-made Vue+Webix Form controls.

## webix-ui component in a Vue app

This techique allows adding a Webix component in a Vue-based app

### Rendering a Webix view

- create a Vue app
- use the tag < webix-ui > inside of the Vue template to define a Webix widget
- specify an object with the Webix UI configuration inside of the data object of the Vue instance
- bind the "config" attribute of < webix-ui > to the data object that contains the UI configuration via the v-bind directive

In the example below we add a Calendar and a List Webix views to a Vue application:

```js
const app = Vue.createApp({
  template: `
    <div style="width:400px; height: 350px;">
        <h3>1. Building UI</h3>
        <webix-ui :config='ui'/>
    </div>
  `,
  data() {
    return {
      ui: {
        cols: [
          {
            view: "calendar",
          },
          {
            view: "list",
            select: true,
            data,
          },
        ],
      },
    };
  }
});

app.component(...); // init webix-ui component

app.mount("#demo1");
```

### Data binding

It's possible to bind data of a Webix widget and a Vue template using a common Vue technique: the _v-bind_ directive.

In the example below we add a Webix DataTable widget into a Vue app and add a button by click on which data in the datatable will be cleared:

```js
const app = Vue.createApp({
    template: `
      <div style="width:400px; height: 250px;">
          <h3>2. One way data binding,
              <button v-on:click="data=[]">Clean</button>
          </h3>
          <webix-ui :config='ui' v-bind:modelValue='data'/>
      </div>
    `,
    data() {
      return {
        data,
        ui: {
          view: "datatable",
          autoheight: true,
          select: "row",
          columns:[
              {
                id: "value",
                header: "Section Index"
              },
              ...
          ]
        }
      };
    }
});

app.component(...); // init webix-ui component

app.mount("#demo2");
```

### Two-way data binding

You can also implement two-way data binding using the regular _v-model_ Vue directive.

For example, we can create a Vue template with an input element and add a < webix-ui > element that will render a Webix Layout with a Slider inside. If a value is changed in an input or a slider, it will automatically get updated in the other component. See the code below:

```js
const app = Vue.createApp({
  template: `
    <div style="width:400px; height: 250px;">
      <h3>3. Two-way data binding, try to change <input v-model.number='result'></h3>
      <webix-ui :config='ui' v-model.number='result'/>
    </div>
  `,
  data() {
    return {
      result: 50,
      ui: {
        margin: 20,
        rows: [
          {
            view: "template",
            type: "header",
            template: "Webix UI",
          },
          {
            view: "slider",
            label: "Change me",
            labelWidth: 120,
            inputWidth: 300,
            value: 50,
            on: {
              onChange() {
                this.$scope.$emit("update:modelValue", this.getValue());
              },
              onValue(value) {
                this.setValue(value);
              },
            },
          },
        ],
      },
    };
  }
});

app.component(...); // init webix-ui component

app.mount("#demo3");
```

## view: "vue" in a Webix app

This technique allows adding a Vue component to a Webix-based app.

For example, we have a Webix Layout with a List view and we want to display a data item in a template depending on the selected List item.
The code sample below shows how a Webix List and a Vue template can be bound together:

```js
const list = {
  view: "list",
  id: "list",
  select: true,
  template: "#value# (#size#)",
  data: [
      { id: 1, value: "Record 1", size: 92 },
      ...
  ]
};

const preview = {
    view: "vue",
    id: "preview",
    template: `
      <div>
          <p>This part is rendered by VueJS, data from the list</p>
          <div v-if='value'>
              <p>Selected: </p>
              <p>Size: <input v-model='size'></p>
          </div>
      </div>
    `,
    data: {
      value: "",
      size: ""
    },
    watch: {
      size(value) {
          $$("list").updateItem($$("list").getSelectedId(), { size: value });
      }
    }
};

$$("preview").bind("list");
```

## Custom Components

If you have some UI element which is reused in an app several times or you just don't like storing UI config in data, it is possible to write a custom Vue component around any Webix component.

### Creating a custom component

For example, we have an input and a slider. We want them to update their values simultaneously.

1. Register a global Vue component using app.component(name,options):

```js
const app = Vue.createApp({ ... });

app.component("my-slider", {
  // component config options
});
```

2. Specify the necessary Vue configuration options for the component

```js
app.component("my-slider", {
  props: ["modelValue"],
  // always an empty div
  template: "<div></div>",
  watch: {
    // updates component when the bound value changes
    value: {
      handler(value) {
        webix.$$(this.webixId).setValue(value);
      },
    },
  },
  mounted() {
    // initializes Webix Slider
    this.webixId = webix.ui({
      // container and scope are mandatory, other properties are optional
      container: this.$el,
      $scope: this,
      view: "slider",
      value: this.modelValue,
    });

    // informs Vue about changed value in case of 2-way data binding
    $$(this.webixId).attachEvent("onChange", function() {
      var value = this.getValue();
      // you can use a custom event here
      this.$scope.$emit("update:modelValue", value);
    });
  },
  // memory cleaning
  unmounted() {
    webix.$$(this.webixId).destructor();
  },
});
```

3. Use the registered component in the Vue component's template as a custom element.

Overall, it would look something like this:

```js
const app = Vue.createApp({
  template: `
  <div style='width:300px;'>
      <h3>Vue + Webix: Custom UI</h3>
      <my-slider v-model.number='progress' />
      <div><input type="text" v-model.number='progress' /></div>
  </div>
  `,
  data: {
    progress: 50,
  },
});

app.component("my-slider", { ... });

app.mount("#demo1");
```

The above is an example based on a global Vue component, but this approach is also possible with local components.

### Form controls

There is also a set of readily available Vue-wrapped Webix Form Controls:

- < webix-text >
- < webix-datepicker >
- < webix-colorpicker >
- < webix-slider >
- < webix-select >
- < webix-richselect >
- < webix-combo >
- < webix-multicombo >
- < webix-radio >
- < webix-segmented >
- < webix-tabbar >
- < webix-textarea >
- < webix-checkbox >

You can use any of these controls in a Vue application as seen in the code below:

```js
const app = Vue.createApp({
  template: `
    <div style='width:500px'>
        <fieldset>
            <legend>User</legend>
            <webix-text         label='First Name'  v-model.string='fname' />
            <webix-text         label='Last Name'   v-model.string='lname' />
            <webix-datepicker   label='Birthdate'   v-model.date='birthdate' />
            <webix-colorpicker  label='Color'       v-model.string='color' />
            <webix-slider       label='Level'       v-model.number='level' />
        </fieldset>
    </div>
  `,
  data: {
    fname: "Reno",
    lname: "Abrams",
    birthdate: new Date(1992, 10, 24),
    color: "#aaaff0",
    level: 20,
  },
});

app.component(...) // register controls

app.mount("#demo1");
```
