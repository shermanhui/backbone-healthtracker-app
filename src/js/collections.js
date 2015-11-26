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
