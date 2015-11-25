var app = app || {};

// template fetching helper function in global namespace
var template = function(id){

	return _.template($("#" + id).html());

};

var ENTER_KEY = 13;

// overall App view, this is helpful b/c events only look at decendants of "el"
app.AppView = Backbone.View.extend({

	el: ".healthapp",

	jumboTemplate: template("jumbotron-template"),

	appTemplate: template("app-template"),

	initialize: function(){

		app.foods = new app.FoodList(); // initialize collection of food

		app.selectedFoods = new app.FoodJournal(); // initialize stored collection of food

		app.foodDetailView = new app.FoodDetailsView({bus: app.Bus}); // selected food item

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

	searchOnEnter: function(e){
		this.$input = this.$("#search-bar");

		if (e.which === ENTER_KEY && this.$input.val().trim()){ // if enter key and there is a value in the search bar

			this.$inputURL = this.$input.val().replace(/ /g, "%20"); // replace spaces with %20 for the url

			this.userSearch = "https://api.nutritionix.com/v1_1/search/"+ this.$inputURL +"?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31";

			app.foods.url = this.userSearch; // use 'this' or var? updates food collection's URL to user search input

			app.foods.fetch().then(function(){ // fetch new list

				if (app.foods.length === 0) {

					$("#list-placeholder").text("No Results Found, Please Check Your Search Query!")

				} else {

					app.foodListView.render();

				}

			});

			this.$input.val(''); //clears input after Enter
		}
	},

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

		this.$el.html(this.appTemplate());

		app.foodJournal.setElement(this.$("food-details")).renderTotal();

		this.assign({
			'#foods'         : app.foodListView,
			'#food-details'  : app.foodDetailView,
			"#foods-journal" : app.foodJournal
		});

		return this;
	},

	renderJumbo: function(){
		this.$el.html(this.jumboTemplate());

		return this;
	}
});

app.NavView = Backbone.View.extend({
	el: ".nav",

	events: {
		"click": "onClick"
	},

	onClick: function(e){
		var $li = $(e.target);
		var url = $li.attr("data-url");

		router.navigate(url, {trigger: true});
	}
});
