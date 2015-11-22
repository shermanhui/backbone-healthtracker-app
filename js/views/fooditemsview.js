var app = app || {};

// Dom element for individual food items
app.FoodItemView = Backbone.View.extend({

	tagName: 'li',

	listTemplate: template("list-template"),

	initialize: function(options){

		this.bus = options.bus;

	},

	events: {

		"click" : "onClick"

	},

	onClick: function(){

		this.bus.trigger("showDetailsOnFood", this.model);

	},

	render: function(){

		this.$el.html(this.listTemplate(this.model.toJSON())); // can do $("#foods").append to get list to show up...but breaks a lot of things

		return this;
	}

});

// render each item in Food Diary
app.ShowFoodJournalItem = Backbone.View.extend({

	tagName: "li",

	journalTemplate: template("journal-template"),

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