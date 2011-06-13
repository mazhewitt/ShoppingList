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

};

