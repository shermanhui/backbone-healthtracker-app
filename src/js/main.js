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
