var app = app || {};

// Declare food collection variable
var FoodItemsCollection = Backbone.Collection.extend({

	model: app.FoodItem,

	url: "https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31"

});

// create global collection
app.foodCollection = new FoodItemsCollection();

app.foodCollection.fetch();

//console.log(app.foodCollection.length);