import Vue from 'vue'

function data_handler(value){
  var view = $$(this.webixId);

  if (typeof value === "object"){
    if (view.setValues)
      view.setValues(value);
    else if (view.parse){
      view.clearAll();
      view.parse(value)
    }
  } else if (view.setValue)
    view.setValue(value);

  webix.ui.each(view, function(sub){
    if (sub.hasEvent && sub.hasEvent("onValue"))
      sub.callEvent("onValue", [value]);
  }, this, true);
}

Vue.component("webix-ui", {
  props: ['config', 'value'],
  watch:{
    value:{
      handler:data_handler
    }
  },

  template:"<div></div>",
    
  mounted:function(){
    var config = webix.copy(this.config);
    config.$scope = this;

    this.webixId = webix.ui(config, this.$el);
    if (this.value)
      data_handler.call(this, this.value);
  },
  destroyed:function(){
    webix.$$(this.webixId).destructor();
  }
});

(function(){ 

var one = ["text", "search", "slider", "checkbox", "colorpicker", "datepicker", "counter", "richtext", "textarea", "tabbar", "segmented", "combo", "richselect", "multicombo", "select", "button", "radio"];
var props = ['label', 'labelWidth', 'options', 'labelPosition'];
var props_handler = function(name){
  return function(value){
    var self = webix.$$(this.webixId);
    self.config[name] = value;
    self.render();
  };
};

function add_input(name){
  var handlers = {
    value:{
      handler:function(value){
        var self = webix.$$(this.webixId);
        self.setValue(value);
      }
    }
  };
  for (var i=0; i<props.length; i++)
    handlers[props[i]] = props_handler(props[i]);

  Vue.component("webix-"+name, {
      props: ['value','label','labelWidth','options','labelPosition','id'],
      template:"<div></div>",
      watch:handlers,

      mounted:function(){
        var config = {
          view:name,
          value: this.value
        };

        if (this.label) config.label = this.label;
        if (this.labelWidth) config.labelWidth = this.labelWidth;
        if (this.labelPosition) config.labelPosition = this.labelPosition;
        if (this.options) config.options = webix.copy(this.options);

        this.webixId = webix.ui(config, this.$el);

        var context = this;
        $$(this.webixId).attachEvent("onChange", function(id){
          var value = this.getValue();
          if (context.value != value)
            context.$emit('input', value);
        })
    },
    destroyed:function(){
      webix.$$(this.webixId).destructor();
    }
  });
}

for (var i=0; i<one.length; i++)
  add_input(one[i]);


})();

webix.protoUI({
	name:"vue",
	$init:function(config){
		var vtm = config.template;
		var id = "vue_"+webix.uid();
		this.$vueData = config.data;

		delete config.data;
		config.template = "<div id='"+id+"'></div>";

		this.attachEvent("onAfterRender", function(){
			this.$vue = new Vue({
				el: "#"+id,
				template: vtm,
				data: this.$vueData,
				methods: this.config.methods || {},
				watch: this.config.watch
			})
		});
	},
	getVue(){
		return this.$vue;
	},
	setValues:function(value){
		if (this.$vue)
			for (var key in value){
				if (typeof this.$vueData[key] !== "undefined")
					this.$vue.$set(this.$vue.$data, key, value[key]);
			}
		else
			this.$vueData = value;
	}
}, webix.ui.template);