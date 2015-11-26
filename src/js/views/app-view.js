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
