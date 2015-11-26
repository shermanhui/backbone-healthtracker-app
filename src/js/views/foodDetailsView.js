var app = app || {};

app.FoodDetailsView = Backbone.View.extend({// show food details, such as calories and food type, allow user to select how many servings they've had

	el: "#food-details",

	tagName: "div",

	detailedTemplate: template("detailed-template"), // grab detailed item view template

	initialize: function(options){

		this.bus = options.bus;

		this.bus.on("showDetailsOnFood", this.onShowDetailsOnFood, this);

	},

	events: {

		"keypress #quantity" : "addToSelectedFoods"

	},

	/*
	* @desc Function that sets how many number of servings the user has
	* @param event object - takes the event object that's passed on keypress and if there is a value
	* @return Backbone Model - returns an updated backbone Model to the Firebase Collection
	*/

	addToSelectedFoods : function(e){

		this.$quantity = $("#quantity");

		if (e.which === ENTER_KEY && this.$quantity.val().trim()){ // need to fix on click..because this if statement prevents adding selected foods

			var numberOfServings = parseInt(this.$quantity.val(), 10);

			this.model.set({ num_servings: numberOfServings });

			app.selectedFoods.add(this.model.toJSON());
		}

	},

	onShowDetailsOnFood: function(food){ // triggered by bus event to render the food details

		this.model = food;

		this.render();

	},

	render: function(){ // hides detail placeholder and renders food details

		if (app.selectedFoods.length) {

			$("#detail-placeholder").hide();

		}

		if (this.model){ // initially there is no model, the model is passed when the event is triggered

			this.$el.html(this.detailedTemplate(this.model.toJSON())); // renders the details of a food selected, and refreshes the view on new food selected

		}

		return this;
	}

});