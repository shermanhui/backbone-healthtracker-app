var app = app || {};
// template fetching helper function in global namespace
var template = function(id){

	return _.template($("#" + id).html());

};

var ENTER_KEY = 13;

app.Bus = _.extend({}, Backbone.Events); // bus object instantiation, pass bus object to have reference to the data in each view
