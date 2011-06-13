/**
 * @author mazda
 */
describe("ShoppingList", function() {
  it("when it is created it has no shopping items", function() {
    var sl = new ShoppingList();
	expect (sl.getNumberOfItems()).toEqual(0);
  });
  
  it("when you add an item, the number of items increases", function() {
    var sl = new ShoppingList();
	var s = new ShoppingItem("shirts", 2);
	sl.addItem(s);
	var s2 = new ShoppingItem("milk");
	sl.addItem(s2);
	expect (sl.getNumberOfItems()).toEqual(2);
  });
  
  it("when you remove an item, the number of items decreases", function() {
	var sl = new ShoppingList();
	var s = new ShoppingItem("shirts", 2);
	sl.addItem(s);
	var s2 = new ShoppingItem("milk");
	sl.addItem(s2);
	sl.removeItem(s2);
	expect (sl.getNumberOfItems()).toEqual(1);
	}); 
	
  it("you can persist it to local storage", function() {
	var sl = new ShoppingList();
	var s = new ShoppingItem("shirts", 2);
	sl.addItem(s);
	var s2 = new ShoppingItem("milk");
	sl.addItem(s2);
	sl.persistToLocalStorage();
	var sl2 = new Shoppinglist();
	sl2.retreiveFromLocalStorage();	
	expect(sl2).toEqual(sl);	
  });
});