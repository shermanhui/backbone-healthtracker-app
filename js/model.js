var app = app || {};

// Food Model
app.FoodItem = Backbone.Model.extend({

	defaults: {

		name: '',

		foodID: '',

		calories: 0

	},

	validate: function(attrs){
		if (!attrs.name){
			return "Name is required.";
		}
	}
});

// Declare food collection variable
app.FoodList = Backbone.Collection.extend({

	model: app.FoodItem,

	// sample API call for mcdonalds items
	//url: "https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31"

});

// create global collection
//app.foods = new FoodItemsCollection()

// sample list of food items
var foods = new app.FoodList([
	new app.FoodItem({name: "apple", foodID: "fruit", calories: 100}),
	new app.FoodItem({name: "orange", foodID: "fruit", calories: 200}),
	new app.FoodItem({name: "banana", foodID: "fruit", calories: 300})
]);

// get the mcdonalds items
//app.foodCollection.fetch();


// Dom element for individual food items
app.FoodItemView = Backbone.View.extend({

	tagName: 'li',

	myTemplate: _.template($("#list-template").html()),

	initialize: function(){

	},

	render: function(){
		this.$el.html(this.myTemplate(this.model.toJSON()));

		return this;
	}

});


// iterate through foodlist
app.FoodListView = Backbone.View.extend({
	tagName: "ul",

	initialize: function(){

	},

	render: function(){
		var self = this;

		self.model.each(function(food){

			var foodlists = new app.FoodItemView({model: food});

			self.$el.append(foodlists.render().$el);
		});
	}

});

app.AppView = new app.FoodListView({el: "#foods", model: foods})

app.AppView.render();

