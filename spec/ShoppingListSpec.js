/**
 * @author mazda
 */
describe("ShoppingList", function() {
  
	var localStorage_get;
	var localStorage_set;
	var fakeserver;
	
  beforeEach(function () {
  	// Refresh Key is held in local storage - so let's stub that
	localStorage_get = sinon.stub(localStorage, "getItem");
	localStorage_set = sinon.stub(localStorage, "setItem");
	localStorage_get.withArgs("GoogleRefreshKey").returns("STUBBED_REFRESH_KEY");
	// now let's repalce the XHR server so we can mock up Google
	fakeserver = sinon.fakeServer.create();
  });
  
  afterEach(function () {
    localStorage_get.restore();
	localStorage_set.restore();
	fakeserver.restore();
  });
  
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

  it ("can be restored from JSON", function(){
  	var shoppingList = new ShoppingList();
	shoppingList.fromJSON(ShoppingListSpecHelper.sl);
	expect(shoppingList.getNumberOfItems()).toEqual(3);
	var shoppingItem = shoppingList.items[shoppingList.itemKey(0)];
	expect (shoppingItem.getItemName()).toEqual("Milk");
	expect (shoppingItem.getHowManyNeeded()).toEqual(2);
  });
	
  it("can serialise to JSON", function(){
  		var sl = new ShoppingList();
	var s = new ShoppingItem("shirts", 2);
	sl.addItem(s);
	var s2 = new ShoppingItem("milk");
	sl.addItem(s2);
	var JSON = sl.toJSON();
	var sl2 = new ShoppingList();
	sl2.fromJSON(JSON);	
	expect(sl2).toEqual(sl);	
  });
  

  
  
  it("can combine with another list, keeping the latest items", function() {
	var mainShoppingList = new ShoppingList();
	mainShoppingList.fromJSON(ShoppingListSpecHelper.oldShoppingList);
	var newerShoppingList = new ShoppingList();
  	newerShoppingList.fromJSON(ShoppingListSpecHelper.newerShoppingList);
	mainShoppingList.combine(newerShoppingList);
	
  });
  
  
  
});


var ShoppingListSpecHelper = {
		oldShoppingList: '\
{\
 "kind": "tasks#tasks",\
 "items": [\
  {\
   "kind": "tasks#task",\
   "title": "Milk",\
   "notes": "get 2",\
   "updated": "2011-06-04T20:20:41.241Z",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "title": "Cheese",\
   "updated": "2011-06-04T20:20:43.818Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoy",\
   "position": "00000000003221225471",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "title": "item 3",\
   "updated": "2011-06-04T20:20:48.485Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoz",\
   "position": "00000000003758096383",\
   "status": "needsAction"\
  }\
 ]\
}\
',
newerShoppingList: '\
{\
 "kind": "tasks#tasks",\
 "items": [\
  {\
   "kind": "tasks#task",\
   "title": "Milk",\
   "notes": "get 25",\
   "updated": "2011-03-04T20:20:41.241Z",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "title": "Cheese",\
   "updated": "2011-06-04T20:20:43.818Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoy",\
   "position": "00000000003221225471",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "title": "item 4",\
   "updated": "2011-06-05T20:20:48.485Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoz",\
   "position": "00000000003758096383",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "title": "item 5",\
   "updated": "2011-06-06T20:20:48.485Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoz",\
   "position": "00000000003758096383",\
   "status": "needsAction"\
  }\
 ]\
}\
',
		combinedShoppingList: '\
{\
 "kind": "tasks#tasks",\
 "items": [\
  {\
   "kind": "tasks#task",\
   "title": "Milk",\
   "notes": "get 2",\
   "updated": "2011-06-04T20:20:41.241Z",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "title": "Cheese",\
   "updated": "2011-06-04T20:20:43.818Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoy",\
   "position": "00000000003221225471",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "title": "item 4",\
   "updated": "2011-06-05T20:20:48.485Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoz",\
   "position": "00000000003758096383",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "title": "item 5",\
   "updated": "2011-06-06T20:20:48.485Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoz",\
   "position": "00000000003758096383",\
   "status": "needsAction"\
  }\
 ]\
}\
'
};
