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
        this.$vue = Vue.createApp({
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
