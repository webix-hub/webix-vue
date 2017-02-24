VueJS adapter for Webix UI
==========================

[![npm version](https://badge.fury.io/js/vue-webix.svg)](https://badge.fury.io/js/vue-webix)

See the [detailed documentation on integration of VueJS with Webix](http://docs.webix.com/desktop__vue.html). 

If you need a framework for using Webix UI, we highly recommend you to use the [Webix Jet](https://webix.gitbooks.io/webix-jet/content/chapter1.html) framework for building web apps with Webix, as it is native for the library and will help you to manage the development stages in the most natural way.

## When to Use Vue+Webix integration

- to add a few complex widgets to a VueJS-based apps (such as datatable, spreadsheet, etc.)
- to use a VueJS app inside of Webix UI (reactive templates, custom forms, etc.) 

You can also create a custom component by wrapping a Webix widget into a Vue component or use one of ready-made Vue+Webix Form controls.

## webix-ui component in a Vue app

This techique allows adding a Webix component in a Vue-based app

### Rendering a Webix view

- create a new Vue instance
- use the tag < webix-ui > inside of the Vue template to define a Webix widget
- specify an object with the Webix UI configuration inside of the data object of the Vue instance
- bind the "config" attribute of < webix-ui > to the data object that contains the UI configuration via the v-bind directive

In the example below we add a Calendar and a List Webix views into a Vue application:

~~~js
new Vue({
    el: "#demo1",
    template:`
        <div style="width:400px; height: 350px;">
            <h3>1. Building UI</h3>
            <webix-ui :config='ui'/>
        </div>
    `,
    data:{
        ui:{
            cols:[{
                view:"calendar",
            },{
                view:"list", select:true,
                data: data
            }]
        }
    }
});
~~~

### Data binding

It's possible to bind data of a Webix widget and a Vue template, using a common Vue technique: the *v-bind* directive.

In the example below we add a Webix DataTable widget into a Vue app and add a button by click on which data in the datatable will be cleared:

~~~js
new Vue({
    el: "#demo2",
    template:`
        <div style="width:400px; height: 250px;">
            <h3>2. One way data binding,
                <button v-on:click="data=[]">Clean</button>
            </h3>
            <webix-ui :config='ui' v-bind:value='data'/>
        </div>
    `,
    data:{
        data:data,
        ui:{
            view:"datatable", autoheight:true, select:"row",
            columns:[
                { id:"value", header:"Section Index" },
                ...
            ]
        }
    }
});
~~~

### Two-way data binding

You can also implement two-way data binding, using the regular *v-model* Vue directive.

For example, we can create a Vue template with an input element and add a < webix-ui > element that will render a Webix Layout with a Slider inside. If a value will be changed in an input or in a slider, it will be modified in the other component correspondingly. See the code below:

~~~js
new Vue({
    el: "#demo3",
    template:`
      <div style="width:400px; height: 250px;">
        <h3>3. Two-way data binding, try to change <input v-model.number='result'></h3>
        <webix-ui :config='ui' v-model.number='result'/>
      </div>
    `,
    data:{
        result:50,
        ui:{
            margin:20, rows:[{
                view:"template", type:"header", template:"Webix UI" 
            },{
                view:"slider", 
                label:"Change me", labelWidth:120, inputWidth:300,
                value:50,
                on:{
                    onChange:function(){
                        this.$scope.$emit("input", this.getValue());
                    },
                    onValue:function(value){
                        this.setValue(value);
                    }
                }
            }]
        }
    }
});
~~~


## view:"vue" in a Webix app

This technique allows adding a Vue component in a Webix-based app.

For example, w have a Webix Layout with a List view and want to display an item data in a template depending on the selected List item.
The code sample below shows how a Webix List and a Vue template can be bound:

~~~js
var list = {
    view:"list", id:"list", select:true,
    template:"#value# (#size#)",
    data:[
        { id:1, value:"Record 1", size:92 },
        ...
    ]
};
 
var preview = {
    view:"vue", id:"preview",
    template:`
        <div>
            <p>This part is rendered by VueJS, data from the list</p>
            <div v-if='value'>
                <p>Selected: </p>
                <p>Size: <input v-model='size'></p>
            </div>
        </div>
    `,
    data:{
        value:"",
        size:""
    },
    watch:{
        size:function(value){
            $$("list").updateItem($$("list").getSelectedId(), { size: value });
        }
    }
};
 
$$("preview").bind("list");
~~~

## Custom Components

If you have some UI element which is reused in an app several times, or you just don't like storing UI config in data, it's possible to write a custom Vue component around any Webix UI. 

### Creating a custom component

For example, we have an input and a slider. We want them to update their values simultaneously.

1) register a new Vue component using usual Vue.component(tagName,options) declaration

~~~js
Vue.component("my-slider", {
    // component config options
});
~~~

2) specify the necessary Vue configuration options for the component

~~~js
Vue.component("my-slider", {
  props: ['value'],
  //always an empty div
  template:"<div></div>",
  watch:{
    // updates component when the bound value changes
    value:{
        handler:function(value){
            webix.$$(this.webixId).setValue(value);
        }
    }
  },
  mounted:function(){
    // initializes Webix Slider
    this.webixId = webix.ui({ 
        // container and scope are mandatory, other properties are optional
        container: this.$el, 
        $scope: this,
        view: "slider", 
        value: this.value 
    })
 
    // informs Vue about changed value in case of 2-way data binding
    $$(this.webixId).attachEvent("onChange", function(){
        var value = this.getValue();
        // you can use a custom event here
        this.$scope.$emit("input", value)
    });
  },
  // memory cleaning
  destroyed:function(){
    webix.$$(this.webixId).destructor();
  }
});
~~~

3) use the registered component in the Vue instance's template as a custom element

For this we should create a new Vue instance:

~~~js
new Vue({
    el: "#demo1",
    template:`
        <div style='width:300px;'>
            <h3>Vue + Webix: Custom UI</h3>
            <my-slider v-model.number='progress' />
            <div><input type="text" v-model.number='progress' /></div>
        </div>`,
    data:{
        progress: 50
    }
});
~~~

### Form controls

There is a set of ready Vue-wrapped Webix Form Controls:

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

You can use any of the Vue-wrapped Webix Form Controls in a Vue application as in the code below:

~~~js
new Vue({
    el: "#demo1",
    template:`
        <div style='width:500px'>
            <fieldset>
                <legend>User</legend>
                <webix-text         label='First Name'  v-model.string='fname' />
                <webix-text         label='Last Name'   v-model.string='lname' />
                <webix-datepicker   label='Birthdate'   v-model.date='birthdate' />
                <webix-colorpicker  label='Color'       v-model.string='color' />
                <webix-slider       label='Level'       v-model.number='level' />
            </fieldset>                                                 
        </div>`,
    data:{
        fname:"Reno",
        lname:"Abrams",
        birthdate:new Date(1992,10,24),
        color:"#aaaff0",
        level:20            
    }
});
~~~
