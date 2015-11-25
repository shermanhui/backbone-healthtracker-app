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