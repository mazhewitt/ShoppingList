/**
 * @author mazda
 */


window.ShoppingListContoller = function (){


	var shoppingList = null;
	
	
	var getShoppingList = function(){
		if (shoppingList == null){
			shoppingList = new ShoppingList();
			shoppingList.retreiveFromLocalStorage();
		}
		return shoppingList;
	};
	
    var persistListToLocalStorage = function(shoppingList){
		var JSON = shoppingList.toJSON();
		localStorage.setItem("ShoppingList", JSON);
	};
	
	var retreiveListFromLocalStorage = function(){
		var JSON = localStorage.getItem("ShoppingList");
		var shoppingList = new ShoppingList();
		shoppingList.fromJSON(JSON);
		return shoppingList;
	};

	return{  // return public API
		
		getShoppingList: getShoppingList, 
		persistListToLocalStorage: persistListToLocalStorage,
		retreiveListFromLocalStorage: retreiveListFromLocalStorage
	};	
	
}();



