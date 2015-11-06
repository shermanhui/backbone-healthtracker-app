var app = app || {};

// Food Model
app.FoodItem = Backbone.Model.extend({

	initialize: function(){

		console.log("I'm a model :)");

	},

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
	url: "https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:3&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31",

	initialize: function(){
		console.log("initializing collection");
	},

	parse: function(response){

		console.log(response.hits);
		console.log("I'm so slow...")

		return response.hits;
	}

});

// sample list of food items
app.foods = new app.FoodList([
	new app.FoodItem({item_name: "apple", item_id: "fruit", nf_calories: 100}),
	new app.FoodItem({item_name: "orange", item_id: "fruit", nf_calories: 200}),
	new app.FoodItem({item_name: "banana", item_id: "fruit", nf_calories: 300})
]);

// create collection
//app.foods = new app.FoodList();

// get the mcdonalds items
app.foods.fetch();


// Dom element for individual food items
app.FoodItemView = Backbone.View.extend({

	tagName: 'li',

	listTemplate: _.template($("#list-template").html()),

	initialize: function(){
		console.log("Rendered Item");
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
		console.log("Food ListView Initalized");
	},

	render: function(){
		var self = this;
		console.log("I'm about to render things");

		// use collection
		self.collection.each(function(model){
			var renderedFood = new app.FoodItemView({model: model})

			self.$el.append(renderedFood.render().$el);
			console.log(renderedFood.el);
		})

		// use models
		// self.model.each(function(food){
		// 	console.log("Rendering Through Collection");
		// 	var foodlists = new app.FoodItemView({model: food});

		// 	self.$el.append(foodlists.render().$el);
		// });
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

app.searchBar = new app.SearchView();

// probably the better way to do it vs the method below
app.AppView = new app.FoodListView({collection: app.foods});

// appView with models
// app.AppView = new app.FoodListView({model: app.foods});

app.AppView.render();
app.searchBar.render();


