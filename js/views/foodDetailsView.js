var app = app || {};

// show food details, such as calories and food type, allow user to select how many servings they've had
app.FoodDetailsView = Backbone.View.extend({

	el: "#food-details",

	tagName: "div",

	detailedTemplate: template("detailed-template"),

	initialize: function(options){

		this.bus = options.bus;

		this.bus.on("showDetailsOnFood", this.onShowDetailsOnFood, this);

	},

	events: {

		"keypress #quantity" : "addToSelectedFoods"

	},

	addToSelectedFoods : function(e){

		this.$quantity = $("#quantity");

		if (e.which === ENTER_KEY && this.$quantity.val().trim()){ // need to fix on click..because this if statement prevents adding selected foods
			var numberOfServings = parseInt(this.$quantity.val(), 10);

			this.model.set({ num_servings: numberOfServings });

			app.selectedFoods.add(this.model.toJSON()); // do I HAVE to do it this way??? This is b/c of the way I've passed the model to the bus
		}

	},

	onShowDetailsOnFood: function(food){ // triggers bus event

		this.model = food;

		this.render();

	},

	render: function(){

		if (app.selectedFoods.length) {

			$("#detail-placeholder").hide();

		}

		if (this.model){ // initially there is no model, the model is passed when the event is triggered

			this.$el.html(this.detailedTemplate(this.model.toJSON())); // renders the details of a food selected, and refreshes the view on new food selected

		}

		return this;
	}

});