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