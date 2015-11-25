var app = app || {};

app.AppRouter = Backbone.Router.extend({
	initialize: function(){

		appView = new app.AppView();

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