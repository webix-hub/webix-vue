import { createApp } from "vue";

function data_handler(value) {
  const view = $$(this.webixId);

  if (typeof value === "object") {
    if (this.copyData) value = webix.copy(value);

    if (view.setValues) view.setValues(value);
    else if (view.parse) {
      view.clearAll();
      view.parse(value);
    }
  } else if (view.setValue) view.setValue(value);

  const subs = view.queryView(sub => {
    return sub.hasEvent && sub.hasEvent("onValue");
  }, "all");

  if (subs.length) {
    subs.forEach(sub => {
      sub.callEvent("onValue", [value]);
    });
  }
}

export function registerWebixUIComponent(app) {
  app.component("webix-ui", {
    props: ["config", "modelValue", "copyData"],
    watch: {
      modelValue: {
        handler: data_handler,
      },
    },
    template: "<div></div>",
    mounted() {
      const config = webix.copy(this.config);
      config.$scope = this;

      this.webixId = webix.ui(config, this.$el);
      if (this.modelValue) data_handler.call(this, this.modelValue);
    },
    unmounted() {
      webix.$$(this.webixId).destructor();
    },
  });
}

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

export function registerWebixControls(app) {
  for (let i = 0; i < controls.length; i++) add_input(app, controls[i]);
}

webix.protoUI(
  {
    name: "vue",
    $init(config) {
      const vtm = config.template;
      const id = "vue_" + webix.uid();
      this.$vueData = config.data;

      delete config.data;
      config.template = "<div id='" + id + "'></div>";

      this.attachEvent("onAfterRender", function() {
        this.$vue = createApp({
          template: vtm,
          methods: this.config.methods || {},
          watch: this.config.watch,
					data: () => {
						return this.$vueData;
					},
        }).mount("#" + id);
      });
    },
    getVue() {
      return this.$vue;
    },
    setValues(value) {
      if (this.$vue)
        for (const key in value) {
          if (typeof this.$vueData[key] !== "undefined")
            this.$vue[key] = value[key];
        }
      else this.$vueData = value;
    },
  },
  webix.ui.template
);
