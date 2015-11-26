var app=app||{};app.FoodList=Backbone.Collection.extend({model:app.FoodItem,url:"https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31",parse:function(e){return e.hits}}),app.FoodJournal=Backbone.Firebase.Collection.extend({model:app.FoodItem,url:"https://fiery-fire-3787.firebaseio.com/"});var app=app||{},template=function(e){return _.template($("#"+e).html())},ENTER_KEY=13;app.Bus=_.extend({},Backbone.Events);var app=app||{};app.FoodItem=Backbone.Model.extend({initialize:function(e){},defaults:{item_name:"",item_id:0,brand_name:"",nf_calories:0,num_servings:1},validate:function(e){return e?void 0:"Data missing!"},parse:function(e){return e.fields}});var app=app||{};app.AppRouter=Backbone.Router.extend({initialize:function(){appView=new app.AppView},routes:{"":"homePage",home:"homePage",application:"viewApp"},homePage:function(){appView.renderJumbo()},viewApp:function(){appView.render()}});var router=new app.AppRouter;Backbone.history.start();var app=app||{};app.AppView=Backbone.View.extend({el:".healthapp",jumboTemplate:template("jumbotron-template"),appTemplate:template("app-template"),initialize:function(){app.foods=new app.FoodList,app.selectedFoods=new app.FoodJournal,app.foodDetailView=new app.FoodDetailsView({bus:app.Bus}),app.foodListView=new app.FoodListView({collection:app.foods,bus:app.Bus}),app.foodJournal=new app.showFoodJournalList({collection:app.selectedFoods})},events:{"keypress #search-bar":"searchOnEnter","click #jumbo-button":"onClick"},onClick:function(e){app.navView.onClick(e)},searchOnEnter:function(e){this.$input=this.$("#search-bar"),e.which===ENTER_KEY&&this.$input.val().trim()&&(this.$inputURL=this.$input.val().replace(/ /g,"%20"),this.userSearch="https://api.nutritionix.com/v1_1/search/"+this.$inputURL+"?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=cd0bcc78&appKey=9aec12536b3cf72ef688e2489200ba31",app.foods.url=this.userSearch,app.foods.fetch().then(function(){0===app.foods.length?$("#list-placeholder").text("No Results Found, Please Check Your Search Query!"):app.foodListView.render()}),this.$input.val(""))},assign:function(e,t){var i;_.isObject(e)?i=e:(i={},i[e]=t),i&&_.each(i,function(e,t){e.setElement(this.$(t)).render()},this)},render:function(){return this.$el.html(this.appTemplate()),app.foodJournal.setElement(this.$("food-details")).renderTotal(),this.assign({"#foods":app.foodListView,"#food-details":app.foodDetailView,"#foods-journal":app.foodJournal}),this},renderJumbo:function(){return this.$el.html(this.jumboTemplate()),this}}),app.NavView=Backbone.View.extend({el:".nav",events:{click:"onClick"},onClick:function(e){var t=$(e.target),i=t.attr("data-url");router.navigate(i,{trigger:!0})}}),app.navView=new app.NavView;var app=app||{};app.FoodDetailsView=Backbone.View.extend({el:"#food-details",tagName:"div",detailedTemplate:template("detailed-template"),initialize:function(e){this.bus=e.bus,this.bus.on("showDetailsOnFood",this.onShowDetailsOnFood,this)},events:{"keypress #quantity":"addToSelectedFoods"},addToSelectedFoods:function(e){if(this.$quantity=$("#quantity"),e.which===ENTER_KEY&&this.$quantity.val().trim()){var t=parseInt(this.$quantity.val(),10);this.model.set({num_servings:t}),app.selectedFoods.add(this.model.toJSON())}},onShowDetailsOnFood:function(e){this.model=e,this.render()},render:function(){return app.selectedFoods.length&&$("#detail-placeholder").hide(),this.model&&this.$el.html(this.detailedTemplate(this.model.toJSON())),this}});var app=app||{};app.FoodItemView=Backbone.View.extend({tagName:"li",listTemplate:template("list-template"),initialize:function(e){this.bus=e.bus},events:{click:"onClick"},onClick:function(){this.bus.trigger("showDetailsOnFood",this.model)},render:function(){return this.$el.html(this.listTemplate(this.model.toJSON())),this}}),app.ShowFoodJournalItem=Backbone.View.extend({tagName:"li",journalTemplate:template("journal-template"),initialize:function(){this.listenTo(this.model,"destroy",this.remove)},events:{"click .removeFood":"removeFood"},removeFood:function(){this.model.destroy()},render:function(){return this.$el.html(this.journalTemplate(this.model.toJSON())),this}});var app=app||{};app.FoodListView=Backbone.View.extend({el:"#foods",tagName:"ul",initialize:function(e){this.bus=e.bus,this.listenTo(this.collection,"reset",this.render)},render:function(){var e=this;return e.collection.length&&$("#list-placeholder").hide(),this.$el.empty(),e.collection.each(function(t){var i=new app.FoodItemView({model:t,bus:e.bus});e.$el.append(i.render().$el)}),this}}),app.showFoodJournalList=Backbone.View.extend({el:"#foods-journal",tagName:"ul",totalCalTemplate:template("total-template"),initialize:function(){this.listenTo(this.collection,"add",this.render),this.listenTo(this.collection,"update",this.renderTotal)},addOne:function(e){var t=new app.ShowFoodJournalItem({model:e});this.$el.append(t.render().$el)},renderTotal:function(){var e=0,t=0,i=0;this.collection.each(function(o){return e=o.get("nf_calories"),num=o.get("num_servings"),t=e*num,i+=t}),$("#total-calories").html(this.totalCalTemplate({total_cals:i}))},render:function(){this.$el.empty(),this.collection.each(this.addOne,this)}});