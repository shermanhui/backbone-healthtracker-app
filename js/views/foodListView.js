var app = app || {};

// iterate through foodlist
app.FoodListView = Backbone.View.extend({

	el: "#foods",

	tagName: "ul",

	initialize: function(options){

		this.bus = options.bus;

		this.listenTo(this.collection, 'reset', this.render);

	},

	render: function(){
		var self = this;

		if (self.collection.length) {

			$("#list-placeholder").hide();

		}

		this.$el.empty(); // empty collection on new render

		self.collection.each(function(food){

			var renderedFood = new app.FoodItemView({model: food, bus: self.bus});

			self.$el.append(renderedFood.render().$el);

		});

		return this;
	}

});

app.showFoodJournalList = Backbone.View.extend({

	el:"#foods-journal",

	tagName: "ul",

	totalCalTemplate: template("total-template"),

	initialize: function(){

		this.listenTo(this.collection, "add", this.render);

		this.listenTo(this.collection, "update", this.renderTotal);

	},

	addOne: function(food){

		var renderedJournal = new app.ShowFoodJournalItem({model: food});

		this.$el.append(renderedJournal.render().$el);

	},

	renderTotal: function(){
		var cals = 0;
		var servings = 0;
		var item_cal = 0;
		var total_calories = 0;

		this.collection.each(function(model){

			cals = model.get("nf_calories");

			num = model.get("num_servings");

			item_cal = cals * num;

			total_calories += item_cal;

			return total_calories;
		});

		$("#total-calories").html(this.totalCalTemplate({total_cals : total_calories}));

	},

	render: function(){

		this.$el.empty();

		this.collection.each(this.addOne, this);
	}

});