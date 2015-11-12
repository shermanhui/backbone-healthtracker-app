//  define app for namespacing
var app = app || {};

// template fetching helper function in global namespace
var template = function(id){
	return _.template($("#" + id).html());
};

// Food Model
app.FoodItem = Backbone.Model.extend({

	initialize: function(attrs){

	},

	defaults: {

		item_name: '',

		item_id: 0,

		nf_calories: 0

	},

	validate: function(attrs){
		if (!attrs){
			return "Data missing!";
		}
	},

	parse: function(response){

		return response.fields; // parse one more time so .toJSON() works when making the food list
	}
});

// Declare food collection variable
app.FoodList = Backbone.Collection.extend({

	model: app.FoodItem,

	// sample API call for mcdonalds items, where the term mcdonalds is, is where I would allow the user to enter their query
	url: "https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:3&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31",

	initialize: function(){
		console.log("initializing collection");
	},

	parse: function(response){

		// returns JSON that's relevant
		return response.hits;
	}

});


// create collection
app.foods = new app.FoodList();

// get the mcdonalds items and render them
app.foods.fetch().then(function(){
	this.AppView = new app.FoodListView({collection: app.foods});
	this.AppView.render();
});


// Dom element for individual food items
app.FoodItemView = Backbone.View.extend({

	tagName: 'li',

	listTemplate: template("list-template"),

	initialize: function(){

	},

	events: {
		"click" : "showDetailsOnFood"
	},

	showDetailsOnFood: function(){
		console.log(this.model.get("item_name") + " " + this.model.get("nf_calories") + " cal");
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

		this.collection.on('reset', this.render, this);

	},

	render: function(){
		var self = this;

		// use collection
		self.collection.each(function(food){

			var renderedFood = new app.FoodItemView({model: food})

			self.$el.append(renderedFood.render().$el);

			// really cool console.log, shows you what's rendered!
			// console.log(renderedFood.el);
		})
	}

});

// show food details, such as calories and food type, allow user to select how many servings they've had
app.FoodDetailsView = Backbone.View.extend({

	el: "#fooddetails",


});

// view that shows total calories, servings and foods consumed
app.ConsumedFood = Backbone.View.extend({

});

// individual search bar view
app.SearchView = Backbone.View.extend({

	el: "#search",

	searchTemplate: template("search-template"),

	initialize: function(){

	},

	render: function(){
		this.$el.html(this.searchTemplate());

		return this;
	}
});

app.searchBar = new app.SearchView();

//commented these out in favor for the .then call after app.foods.fetch()

// probably the better way to do it vs the method below
//app.AppView = new app.FoodListView({collection: app.foods});

//app.AppView.render();
app.searchBar.render();


