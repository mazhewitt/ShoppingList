/**
 * @author mazda
 */
describe("ShoppingListController", function() {
  
  var localStorage_get;
  var localStorage_set;
  var fakeserver;
  
  beforeEach(function () {
  	// Refresh Key is held in local storage - so let's stub that
	//localStorage_get = sinon.stub(localStorage, "getItem");
	//localStorage_set = sinon.stub(localStorage, "setItem");
  });
  
  afterEach(function () {
    if (localStorage_get != null) {
		localStorage_get.restore();
		localStorage_set.restore();
	}
  });
  
it("it can persist a ShoppingList to local storage, then retreive it again", function() {
	var shoppingList1 = new ShoppingList();
	var shoppingItem1 = new ShoppingItem("shirts", 2);
	shoppingList1.addItem(shoppingItem1);
	var shoppingItem2 = new ShoppingItem("milk");
	shoppingList1.addItem(shoppingItem2);
	var shoppingListController = window.ShoppingListContoller;
	shoppingListController.persistListToLocalStorage(shoppingList1);
	var shoppingList2 = shoppingListController.retreiveListFromLocalStorage();	
	expect(shoppingList2).toEqual(shoppingList1);	
  });
  
 
  
  it("can fetch the latest list from Google and combine it with the local list", function() {
	  	// Refresh Key is held in local storage - so let's stub that
	localStorage_get = sinon.stub(localStorage, "getItem");
	localStorage_set = sinon.stub(localStorage, "setItem");
	localStorage_get.withArgs("GoogleRefreshKey").returns("STUBBED_REFRESH_KEY");
	// now let's repalce the XHR server so we can mock up Google
	fakeserver = sinon.fakeServer.create();
	var spy = sinon.spy();
	var tl = "";
	GoogleTasksSpecHelper.setupFakeSuccessfulAuthServer(fakeserver);	
	GoogleTasksSpecHelper.setupFakeSuccessfulTaskServer(fakeserver, tl);				 
	
	var shoppingListController = window.ShoppingListContoller;
	shoppingListController.initialiseList();
	shoppingListController.eventServer.on(ShoppingListContoller.REMOTE_LIST_UPDATED, spy);	
	shoppingListController.updateShoppingListFromGoogle();
	fakeserver.respond();
	expect (spy).toHaveBeenCalled();
	
  });
  
  
  
  it("can tell you when you are online", function() {
	expect (1).toEqual(0);
  });
  
  it("can event a listener (the view) when the shopping list is updated", function() {
	expect (1).toEqual(0);
  });
  
  it("can tell you when you have gone offline", function() {
	expect (1).toEqual(0);
  });
  
  
  
});

var ShoppingListControllerSpecHelper = {
	oldShoppingList: '',
	newerShoppingList: ''
};
