const controls = [
  "text",
  "search",
  "slider",
  "checkbox",
  "colorpicker",
  "datepicker",
  "counter",
  "richtext",
  "textarea",
  "tabbar",
  "segmented",
  "combo",
  "richselect",
  "multicombo",
  "select",
  "button",
  "radio",
];
const props = ["label", "labelWidth", "options", "labelPosition"];

const props_handler = function(name) {
  return function(value) {
    const self = webix.$$(this.webixId);
    self.config[name] = value;
    self.render();
  };
};

function add_input(app, name) {
  const handlers = {
    modelValue: {
      handler(value) {
        const self = webix.$$(this.webixId);
        self.setValue(value);
      },
    },
  };

  for (let i = 0; i < props.length; i++)
    handlers[props[i]] = props_handler(props[i]);

  app.component("webix-" + name, {
    props: ["modelValue", "label", "labelWidth", "options", "labelPosition", "id"],
    template: "<div></div>",
    watch: handlers,
    mounted() {
      const config = {
        view: name,
        value: this.modelValue,
      };

      if (this.label) config.label = this.label;
      if (this.labelWidth) config.labelWidth = this.labelWidth;
      if (this.labelPosition) config.labelPosition = this.labelPosition;
      if (this.options) config.options = webix.copy(this.options);

      this.webixId = webix.ui(config, this.$el);

      const context = this;

      $$(this.webixId).attachEvent("onChange", function() {
        const value = this.getValue();
        if (context.modelValue != value)
          context.$emit("update:modelValue", value);
      });
    },
    unmounted() {
      webix.$$(this.webixId).destructor();
    },
  });
}

function registerWebixControls(app) {
  for (let i = 0; i < controls.length; i++) add_input(app, controls[i]);
}
