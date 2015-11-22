app.navView = new app.NavView();

app.Bus = _.extend({}, Backbone.Events); // bus object instantiation, pass bus object to have reference to the data in each view

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

