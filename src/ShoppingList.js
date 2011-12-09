/**
 * @author mazda
 */


function ShoppingList(){
	this.myData = {
  		kind: "tasks#taskList",
  		selfLink: "https://www.googleapis.com/tasks/v1/users/@me/taskListID",
  		title: "ShoppingList"
  	}
	this.items = {};
	this.eventServer = new EventEmitter();
	this.ITEM_ADDED_EVENT = "ShoppingList.ITEM_ADDED_EVENT";
	this.ITEM_REMOVED_EVENT = "ShoppingList.ITEM_REMOVED_EVENT";
	this.SHOPPING_LIST_UPDATED = "ShoppingList.SHOPPING_LIST_UPDATED";
}

ShoppingList.prototype.addItem = function(theNewShoppingItem) {
	var oldShoppingItem = this.items[theNewShoppingItem.getItemName()];
	if (oldShoppingItem != undefined){
		
		var insertingDate = theNewShoppingItem.getUpdatedDateTime();
		var originalDate = oldShoppingItem.getUpdatedDateTime();
		
		if ( insertingDate < originalDate) {
			console.log(JSON.stringify(theNewShoppingItem) + "<" + JSON.stringify(oldShoppingItem));
			console.log(JSON.stringify(insertingDate) + "<" + JSON.stringify(originalDate));
			return;
		}
	}
	this.items[theNewShoppingItem.getItemName()] = theNewShoppingItem;
	this.eventServer.emit(this.ITEM_ADDED_EVENT);
	this.eventServer.emit(this.SHOPPING_LIST_UPDATED);
};

ShoppingList.prototype.getItem = function(name) {
	return this.items[name];
};

ShoppingList.prototype.getNumberOfItems = function() {
	var count = 0;
    for(var prop in this.items) {  
    	count++;
    }
    return count;
};

ShoppingList.prototype.removeItem = function(item){
	delete this.items[item.getItemName()];
	this.eventServer.emit(this.ITEM_REMOVED_EVENT);
	this.eventServer.emit(this.SHOPPING_LIST_UPDATED);
};

ShoppingList.prototype.toJSON = function(){
	var shoppingListJSON = '{"kind": "tasks#tasks",\n"items":[';
	var myKeys = [], i=0;
	for (myKeys[i++] in this.items);
	for  (var x =0; x < i; x++){
		shoppingListJSON += this.items[myKeys[x]].toJSON();
		if (x != (i-1))
		  shoppingListJSON += ",";
	}
	shoppingListJSON += "]}";
	return shoppingListJSON;
};

ShoppingList.prototype.keys = function(){
	var myKeys = [], i=0;
	for (myKeys[i++] in this.items);
	return myKeys;
};

ShoppingList.prototype.itemKey = function(x){
	return this.keys()[x];
};

ShoppingList.prototype.fromJSON = function(shoppingListJSON){
	console.log("loading shoppingList from:\n "+shoppingListJSON);
	if (shoppingListJSON != null) {
		var shoppingItems = jQuery.parseJSON(shoppingListJSON);
		for (var i in shoppingItems.items) {
			var s = new ShoppingItem();
			s.fromJSON(shoppingItems.items[i])
			this.addItem(s);
		}
	  this.eventServer.emit(this.SHOPPING_LIST_UPDATED);
	}
};
ShoppingList.prototype.combine = function(otherList, dateLastResync){ 
    var me = this;
	if ((otherList != null) || (otherList = undefined)) {
	  $.each(otherList.items, function(index, shoppingItem){
	  	me.addItem(shoppingItem);
		});
	  $.each(this.items, function(index, shoppingItem){
	  	  var otherItem = otherList.getItem(shoppingItem.getItemName());
		  if ((otherItem == null) || (otherItem == undefined)){
		  	if (shoppingItem.getUpdatedDateTime() < new Date(dateLastResync)){
				me.removeItem(shoppingItem);
			}
		  }
		});
	}
};
