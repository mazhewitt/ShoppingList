/**
 * @author mazda
 */
describe("GoogleTasksAPI", function () {
	
	var server;
	var localStorage_get;
	var localStorage_set;
	
  beforeEach(function () {
  	// Refresh Key is held in local storage - so let's stub that
	localStorage_get = sinon.stub(localStorage, "getItem");
	localStorage_set = sinon.stub(localStorage, "setItem");
	localStorage_stub.withArgs("GoogleRefreshKey").returns("STUBBED_REFRESH_KEY");
	// now let's repalce the XHR server so we can mock up Google
	server = sinon.fakeServer.create();
  });
  
  afterEach(function () {
    localStorage_get.restore();
	localStorage_set.restore();
	server.restore();
  });
	
  it("can authenticate with google when refresh key is in local storage", sinon.test(function() {
    var spy = sinon.spy();
	server.respondWith(
	
	);

	
	// now we need a fake XHR server to represent the authentication server
	
	var gt = window.GoogleTasks;   
	gt.eventServer.on(gt.ACCESS_TOKEN_REFRESHED_EVENT, spy);
	runs(function () {
	  gt.authenticate();
	});
	waits(1000);
	runs(function () {
	  expect (spy.called).toHaveBeenCalled();
	  expect (gt.isAuthenticated()).toBeTruthy();
  	});
  }));
  
  it("can can retreive a shopping list from Google", sinon.test(function () {
  	var gt = window.GoogleTasks;  
	var shoppingList;
	runs(function () {
		gt.authenticate();
	});
	while(!gt.isAuthenticated()){
		waits(50);
	}
	runs(function () {
		gt.eventServer.on(gt.TASK_LIST_RETREIVED, function(sl){shoppingList = sl;});
		gt.retreiveTaskList();
	});
	waits(1000);
	runs(function () {
	  expect (shoppingList).toBeDefined();
  	});
  }));
  
});