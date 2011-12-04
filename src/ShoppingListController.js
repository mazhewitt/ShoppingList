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
	


	return{  // return public API
		
		getShoppingList: getShoppingList
	};	
	
}();



