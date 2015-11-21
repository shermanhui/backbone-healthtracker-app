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

		brand_name: '',

		nf_calories: 0,

		num_servings: 1,

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

	},

	parse: function(response){

		// returns JSON that's relevant
		return response.hits;
	}

});

//Firebase collection to be created
app.FoodJournal = Backbone.Firebase.Collection.extend({

	model: app.FoodItem,

	url: "https://fiery-fire-3787.firebaseio.com/",

	initialize: function(){

		console.log("Firebase Collection Initialized");

	}

});

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

app.Bus = _.extend({}, Backbone.Events); // bus object instantiation, pass bus object to have reference to the data in each view

app.FoodDetailView = new app.FoodDetailsView({bus: app.Bus});

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

app.ShowFoodJournalList = Backbone.View.extend({

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

// overall App view, this is helpful b/c events only look at decendants of "el"
app.AppView = Backbone.View.extend({

	el: ".healthapp",

	jumboTemplate: template("jumbotron-template"),

	appTemplate: template("app-template"),

	initialize: function(){

		app.foods = new app.FoodList(); // initialize collection of food

		app.selectedFoods = new app.FoodJournal(); // initialize stored collection of food

		app.foodListView = new app.FoodListView({collection: app.foods, bus: app.Bus}); // new food list view

		app.foodJournal = new app.ShowFoodJournalList({collection: app.selectedFoods}); // new stored list view

	},

	events: {

		"keypress #search-bar": "searchOnEnter",

		"click #jumbo-button": "onClick"
	},

	onClick: function(e){

		navView.onClick(e);

	},

	searchOnEnter: function(e){
		this.$input = this.$("#search-bar");

		if (e.which === ENTER_KEY && this.$input.val().trim()){ // if enter key and there is a value in the search bar

			this.$inputURL = this.$input.val().replace(/ /g, "%20"); // replace spaces with %20 for the url

			this.userSearch = "https://api.nutritionix.com/v1_1/search/"+ this.$inputURL +"?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31";

			app.foods.url = this.userSearch; // use 'this' or var? updates food collection's URL to user search input

			app.foods.fetch().then(function(){ // fetch new list

				app.foodListView.render();

			});

			this.$input.val(''); //clears input after Enter
		}
	},

	render: function(){
		this.$el.html(this.appTemplate());

		return this;
	},

	renderJumbo: function(){
		this.$el.html(this.jumboTemplate());

		return this;
	}
});

app.AppView = new app.AppView();
// app.AppRouter = Backbone.Router.extend({

// 	routes: {
// 		'': 'homePage',
// 		'home': 'homePage',
// 		'application': 'viewApp'
// 	},

// 	homePage: function(){

// 		var AppView = new app.AppView();
// 		AppView.renderJumbo();

// 	},

// 	viewApp: function(){

// 		var AppView = new app.AppView();
// 		AppView.render();

// 	}
// });

// var router = new app.AppRouter();
// Backbone.history.start();

// app.NavView = Backbone.View.extend({
// 	el: "#nav",

// 	events: {
// 		"click": "onClick"
// 	},

// 	onClick: function(e){
// 		var $li = $(e.target);
// 		var url = $li.attr("data-url");

// 		router.navigate(url, {trigger: true});
// 	}
// });

// var navView = new app.NavView();
