var app = app || {};

app.FoodItemView = Backbone.View.extend({ // View for Individual Food Items

	tagName: 'li',

	listTemplate: template("list-template"), // grab food list template

	initialize: function(options){

		this.bus = options.bus;

	},

	events: {

		"click" : "onClick"

	},

	onClick: function(){

		this.bus.trigger("showDetailsOnFood", this.model); // shows user details on food item

	},

	render: function(){

		this.$el.html(this.listTemplate(this.model.toJSON()));

		return this;
	}

});

app.ShowFoodJournalItem = Backbone.View.extend({ // View for each Stored Food Item

	tagName: "li",

	journalTemplate: template("journal-template"), // grab stored food list template

	initialize: function(){

		this.listenTo(this.model, "destroy", this.remove);

	},

	events: {

		"click .removeFood" : "removeFood"

	},

	removeFood: function(){

		this.model.destroy();

	},

	render: function(){

		this.$el.html(this.journalTemplate(this.model.toJSON()));

		return this;
	}

});