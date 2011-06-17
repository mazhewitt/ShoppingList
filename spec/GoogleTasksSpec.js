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
	localStorage_get.withArgs("GoogleRefreshKey").returns("STUBBED_REFRESH_KEY");
	// now let's repalce the XHR server so we can mock up Google
	server = sinon.fakeServer.create();
  });
  
  afterEach(function () {
    localStorage_get.restore();
	localStorage_set.restore();
	server.restore();
  });
	
  it("can authenticate with google when refresh key is in local storage", function() {
	var spy = sinon.spy();
	// now we need a fake XHR server to represent the authentication server
	server.respondWith(	"GET", "/some/article/comments.json",
                        [200, { "content-type": "application/json; charset=UTF-8" },
                        '{"access_token":"1/fFAGRNJru1FTz70BzhT3Zg","expires_in":3920,"refresh_token":"1/6BMfW9j53gdGImsixUH6kU5RsR4zwI9lUVX-tqf8JXQ"}']
					  );
	var gt = window.GoogleTasks;   
	gt.eventServer.on(gt.ACCESS_TOKEN_REFRESHED_EVENT, spy);
    gt.authenticate();
	server.respond();
	expect (spy).toHaveBeenCalled();
	expect (gt.isAuthenticated()).toBeTruthy();
  });
  
  it("can can retreive a shopping list from Google", function () {
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
  });
  
});