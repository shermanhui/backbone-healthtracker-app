var app = app || {};

// Food Model
app.FoodItem = Backbone.Model.extend({

	defaults: {

		name: '',

		foodID: '',

		calories: ''

	}
});