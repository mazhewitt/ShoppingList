/**
 * @author mazda
 */
describe("ShoppingListController", function() {
  
  var localStorage_get;
  var localStorage_set;
  
  beforeEach(function () {
  	// Refresh Key is held in local storage - so let's stub that
	localStorage_get = sinon.stub(localStorage, "getItem");
	localStorage_set = sinon.stub(localStorage, "setItem");
  });
  
  afterEach(function () {
    localStorage_get.restore();
	localStorage_set.restore();
  });
  
  it("can combine the stored list with the remote list", function() {
	var slc = window.ShoppingListContoller;
	
	
  });
  
  it("should create a new Emptry Shopping list when there isn't one in local storage", function() {
	
	localStorage_get.withArgs("ShoppingList").returns(null);
	var slc = window.ShoppingListContoller;
	var sl = slc.getShoppingList();
	expect(sl).toNotBe(null);
	
  });
  
  it("can fetch the latest list", function() {
	expect (1).toEqual(0);
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