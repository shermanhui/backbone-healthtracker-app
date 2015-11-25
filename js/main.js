app.Bus = _.extend({}, Backbone.Events); // bus object instantiation, pass bus object to have reference to the data in each view

var router = new app.AppRouter();
Backbone.history.start();

