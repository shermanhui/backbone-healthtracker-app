var app = app || {};

app.FoodListView = Backbone.View.extend({ // User Searched Food Item View

	el: "#foods",

	tagName: "ul",

	initialize: function(options){

		this.bus = options.bus; // set up the Event bus

		this.listenTo(this.collection, 'reset', this.render);

	},

	render: function(){
		var self = this;

		if (self.collection.length) {

			$("#list-placeholder").hide();

		}

		this.$el.empty(); // empty collection on new render

		self.collection.each(function(food){ // iterate through collection to render each list item

			var renderedFood = new app.FoodItemView({model: food, bus: self.bus}); // pass in each item that's to be rendered

			self.$el.append(renderedFood.render().$el);

		});

		return this;
	}

});

app.showFoodJournalList = Backbone.View.extend({ // User Stored Food Items View

	el:"#foods-journal",

	tagName: "ul",

	totalCalTemplate: template("total-template"),

	initialize: function(){

		this.listenTo(this.collection, "add", this.render);

		this.listenTo(this.collection, "update", this.renderTotal);

	},

	addOne: function(food){ // takes a food item and renders it

		var renderedJournal = new app.ShowFoodJournalItem({model: food});

		this.$el.append(renderedJournal.render().$el);

	},

	renderTotal: function(){ // renders total calories consumed
		var cals = 0;
		var servings = 0;
		var item_cal = 0;
		var total_calories = 0;

		this.collection.each(function(model){ // iterate through collection to calculate total calories consumed

			cals = model.get("nf_calories");

			num = model.get("num_servings");

			item_cal = cals * num;

			total_calories += item_cal;

			return total_calories;
		});

		$("#total-calories").html(this.totalCalTemplate({total_cals : total_calories})); // update DOM element to current calories consumed

	},

	render: function(){

		this.$el.empty(); // empties collection to prevent duplicate items rendering

		this.collection.each(this.addOne, this); // iterate through collection to render each list item
	}

});