var app = app || {};

app.FoodList = Backbone.Collection.extend({ // Food Collection

	model: app.FoodItem,

	url: "https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31",

	parse: function(response){

		// returns JSON that's relevant
		return response.hits;
	}

});

app.FoodJournal = Backbone.Firebase.Collection.extend({ //Firebase collection to be created

	model: app.FoodItem,

	url: "https://fiery-fire-3787.firebaseio.com/"

});

var app = app || {};

/*
 * @desc Helper function that retrieves templates
 * @param string - the id of the template
 * @return underscore function - returns template according to id given
 */
var template = function(id){

	return _.template($("#" + id).html());

};

var ENTER_KEY = 13; // for enter key functionality

app.Bus = _.extend({}, Backbone.Events); // bus object instantiation, pass bus object to have reference to the data in each view

var app = app || {}; //  define app for namespacing

app.FoodItem = Backbone.Model.extend({ // Food Model

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

var app = app || {};

app.AppRouter = Backbone.Router.extend({ // set up the router functionality for the project
	initialize: function(){

		appView = new app.AppView(); // when the router is initialized, instantiate the appview to get everything else up and running

	},

	routes: {
		'': 'homePage',
		'home': 'homePage',
		'application': 'viewApp'
	},

	homePage: function(){

		appView.renderJumbo();

	},

	viewApp: function(){

		appView.render();

	}
});

var router = new app.AppRouter();
Backbone.history.start();
var app = app || {};

app.AppView = Backbone.View.extend({ // overall App view, this is helpful b/c events only look at the decendants of "el"

	el: ".healthapp",

	jumboTemplate: template("jumbotron-template"), // grab landing page template

	appTemplate: template("app-template"), // grab application structure template

	initialize: function(){

		app.foods = new app.FoodList(); // initialize collection of food

		app.selectedFoods = new app.FoodJournal(); // initialize stored collection of food

		app.foodDetailView = new app.FoodDetailsView({bus: app.Bus}); // initialize selected food item

		app.foodListView = new app.FoodListView({collection: app.foods, bus: app.Bus}); // new food list view

		app.foodJournal = new app.showFoodJournalList({collection: app.selectedFoods}); // new stored list view

	},

	events: {

		"keypress #search-bar": "searchOnEnter",

		"click #jumbo-button": "onClick"
	},

	onClick: function(e){

		app.navView.onClick(e);

	},

	/*
	* @desc Updates Food Collection URL and fetches data from API to render food list on screen
	* @param string - user input for the food they ate
	* @return Backbone collection - returns a backbone collection and renders it, also clears the searchbar
	*/

	searchOnEnter: function(e){
		this.$input = this.$("#search-bar");

		if (e.which === ENTER_KEY && this.$input.val().trim()){ // if enter key and there is a value in the search bar

			this.$inputURL = this.$input.val().replace(/ /g, "%20"); // replace spaces with %20 for the url

			this.userSearch = "https://api.nutritionix.com/v1_1/search/"+ this.$inputURL +"?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31";

			app.foods.url = this.userSearch; // use 'this' or var? updates food collection's URL to user search input

			app.foods.fetch().then(function(){ // fetch new list

				if (app.foods.length === 0) {

					$("#list-placeholder").text("No Results Found, Please Check Your Search Query!");

				} else {

					app.foodListView.render();

				}

			});

			this.$input.val(''); //clears input after Enter
		}
	},

	/*
	* @desc Helper function that calls setElement in order to ensure Views don't lose bindings to event handlers in the DOM
	* @param string jQuery selector - takes a HTML selector tag
	* @param string Backbone View - takes a Backbone View
	*/

	assign: function(selector, view) {

		var selectors;

		if (_.isObject(selector)) {

			selectors = selector;

		} else {

			selectors = {};

			selectors[selector] = view;

		}

		if (!selectors) return;

		_.each(selectors, function (view, selector) {

			view.setElement(this.$(selector)).render();

		}, this);
	},

	render: function(){

		this.$el.html(this.appTemplate()); // renders the basic app structure

		app.foodJournal.setElement(this.$("food-details")).renderTotal(); // manually call setElement for "#total-calories" counter

		this.assign({ // assign renders each respective view
			'#foods'         : app.foodListView,
			'#food-details'  : app.foodDetailView,
			'#foods-journal' : app.foodJournal
		});

		return this;
	},

	renderJumbo: function(){ // render the landing page user's see
		this.$el.html(this.jumboTemplate());

		return this;
	}
});

app.NavView = Backbone.View.extend({ // NavBar View
	el: ".nav",

	events: { // event listener
		"click": "onClick"
	},

	/*
	* @desc Listens to user clicks on the navbar items and the router listens to the item clicked
	* @param event object - takes the event object that happens on click
	*/

	onClick: function(e){
		var $li = $(e.target);
		var url = $li.attr("data-url");

		router.navigate(url, {trigger: true});
	}
});

app.navView = new app.NavView(); // initialize the navbar view

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
var app = app || {};

app.FoodItemView = Backbone.View.extend({ // View for Individual Food Items

	tagName: 'li',

	listTemplate: template("list-template"), // grab food list template

	initialize: function(options){

		this.bus = options.bus;

	},

	events: {

		"click" : "onClick"

	},

	onClick: function(){

		this.bus.trigger("showDetailsOnFood", this.model); // shows user details on food item

	},

	render: function(){

		this.$el.html(this.listTemplate(this.model.toJSON()));

		return this;
	}

});

app.ShowFoodJournalItem = Backbone.View.extend({ // View for each Stored Food Item

	tagName: "li",

	journalTemplate: template("journal-template"), // grab stored food list template

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