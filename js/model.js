var app = app || {};

// Food Model
app.FoodItem = Backbone.Model.extend({

	defaults: {

		name: '',

		foodID: '',

		calories: 0

	},

	urlRoot: "https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31",

	validate: function(attrs){
		if (!attrs.name){
			return "Name is required.";
		}
	}
});

// Declare food collection variable
app.FoodList = Backbone.Collection.extend({

	model: app.FoodItem,

	initialize: function(){
		console.log("initializing collection");
	},

	// sample API call for mcdonalds items
	url: "https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:3&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31"

});

// sample list of food items
// var foods = new app.FoodList([
// 	new app.FoodItem({name: "apple", foodID: "fruit", calories: 100}),
// 	new app.FoodItem({name: "orange", foodID: "fruit", calories: 200}),
// 	new app.FoodItem({name: "banana", foodID: "fruit", calories: 300})
// ]);

// create global collection
app.foods = new app.FoodList();

// get the mcdonalds items
app.foods.fetch({
	success: function(response){
		console.log(response.models[0].attributes.hits[0].fields);
	}
});


// Dom element for individual food items
app.FoodItemView = Backbone.View.extend({

	tagName: 'li',

	listTemplate: _.template($("#list-template").html()),

	initialize: function(){

	},

	render: function(){
		this.$el.html(this.listTemplate(this.model.toJSON()));

		return this;
	}

});


// iterate through foodlist
app.FoodListView = Backbone.View.extend({
	el: "#foods",

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

// individual search bar view
app.SearchView = Backbone.View.extend({

	el: "#search",

	searchTemplate: _.template($("#search-template").html()),

	initialize: function(){

	},

	render: function(){
		this.$el.html(this.searchTemplate());

		return this;
	}
})

var searchBar = new app.SearchView();
app.AppView = new app.FoodListView({model: app.foods});

app.AppView.render();
searchBar.render();


