function data_handler(value){
  var view = $$(this.webixId);

  if (typeof value === "object"){
    if (this.copyData)
      value = webix.copy(value);

    if (view.setValues)
      view.setValues(value);
    else if (view.parse){
      view.clearAll();
      view.parse(value)
    }
  } else if (view.setValue)
    view.setValue(value);

  var subs = view.queryView(function(sub) {
    return sub.hasEvent && sub.hasEvent("onValue");
  }, "all");

  if (subs.length) {
    for (var i = 0; i < subs.length; i++) {
      subs[i].callEvent("onValue", [value]);
    };
  }
}

Vue.component("webix-ui", {
  props: ['config', 'value', 'copyData'],
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