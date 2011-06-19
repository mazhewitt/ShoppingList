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
}

ShoppingList.prototype.addItem = function(si) {
	var osi = this.items[si.getItemName()];
	console.log(JSON.stringify(si) + ">=" + JSON.stringify(osi));
	if (osi == undefined || si.getUpdatedDateTime() >= osi.getUpdatedDateTime()) {
		this.items[si.getItemName()] = si;
	}
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
};

ShoppingList.prototype.persistToLocalStorage = function(){
	var shoppingListJSON = '{"items":[';
	var myKeys = [], i=0;
	for (myKeys[i++] in this.items);
	for  (var x =0; x < i; x++){
		shoppingListJSON += this.items[myKeys[x]].toJSON();
		if (x != (i-1))
		  shoppingListJSON += ",";
	}
	shoppingListJSON += "]}";
	localStorage.setItem("shoppingList", shoppingListJSON);
};

ShoppingList.prototype.retreiveFromLocalStorage = function(){
	var shoppingListJSON = localStorage.getItem("shoppingList");
	console.log(shoppingListJSON);
	var shoppingItems = jQuery.parseJSON( shoppingListJSON );
	for (var i in shoppingItems.items) {
	  var s = new ShoppingItem();
	  s.fromJSON(shoppingItems.items[i])
	  this.addItem(s);
	}
}
