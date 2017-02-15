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