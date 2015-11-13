//  define app for namespacing
var app = app || {};

// template fetching helper function in global namespace
var template = function(id){
	return _.template($("#" + id).html());
};

var ENTER_KEY = 13;

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
	url: "https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31",

	initialize: function(){
		console.log("initializing collection");
	},

	parse: function(response){

		// returns JSON that's relevant
		return response.hits;
	}

});


// Dom element for individual food items
app.FoodItemView = Backbone.View.extend({

	tagName: 'li',

	listTemplate: template("list-template"),

	detailedTemplate: template("detailed-template"),

	initialize: function(){

	},

	events: {
		"click" : "showDetailsOnFood"
	},

	showDetailsOnFood: function(){

		$("#fooddetails").append(this.detailedTemplate(this.model.toJSON())); 		// appends details template to fooddetails section

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

		this.$el.empty(); // empty collection on new render
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
// app.FoodDetailsView = Backbone.View.extend({

// 	el: "#fooddetails",

// 	initialize: function(){

// 	},


// 	render: function(){
// 		var self = this;

// 		self.$el.append()
// 	}


// });

// view that shows total calories, servings and foods consumed
app.ConsumedFood = Backbone.View.extend({

});

// general App view, this is helpful b/c events only look at decendants of "el"
app.AppView = Backbone.View.extend({

	el: ".healthapp",

	initialize: function(){
		app.foods = new app.FoodList(); // initialize collection of food

		app.foodList = new app.FoodListView({collection: app.foods});

		console.log(app.foods, "on initialization")

		this.$input = this.$("#search-bar"); // assign variable to jQuery selector for the search bar

	},

	events: {

		"keypress #search-bar": "searchOnEnter"

	},

	searchOnEnter: function(e){

		if (e.which === ENTER_KEY && this.$input.val().trim()){ // if enter key and there is a value in the search bar
			this.$inputURL = this.$input.val().replace(/ /g, "%20"); // replace spaces with %20 for the url

			this.userSearch = "https://api.nutritionix.com/v1_1/search/"+ this.$inputURL +"?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31";

			app.foods.url = this.userSearch; // use 'this' or var? updates food collection's URL to user search input

			app.foods.fetch().then(function(){ // fetch new list

				app.foodList.render();

			});

			this.$input.val(''); //clears input after Enter
		}
	}
});

app.AppView = new app.AppView();
