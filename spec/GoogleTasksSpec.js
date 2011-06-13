/**
 * @author mazda
 */
describe("GoogleTasksAPI", function() {
  it("can authenticate with google", function() {
    var spy = sinon.spy();
	var gt = new GoogleTasks();   
	runs(function () {
	  gt.authenticate(spy);
	});
	waits(1000);
	runs(function () {
	  expect (spy.called).toBeTruthy();
  	});
  });
  
  it("can can retreive a shopping list from Google", function() {
  	var gt = new GoogleTasks();  
	  var shoppingList;
	  runs(function () {
	  gt.authenticate(function(){
	  	gt.fetchShoppingList(function(sl){
			shoppingList= sl;
		});
	  });
	});
	waits(1000);
	runs(function () {
	  expect (sl).toBeDefined();
  	});
  });
  
});