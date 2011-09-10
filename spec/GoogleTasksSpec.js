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
	server.respondWith(	"POST", "https://accounts.google.com/o/oauth2/token",
                        [200, { "content-type": "application/json; charset=UTF-8" },
                        '{"access_token":"MY_STUB_ACCESS_TOKEN","expires_in":3920,"refresh_token":"MY_STUB_REFRESH_TOKEN"}']
					  );
	var gt = window.GoogleTasks;   
	gt.eventServer.on(gt.ACCESS_TOKEN_REFRESHED_EVENT, spy);
    gt.authenticate();
	server.respond();
	expect (spy).toHaveBeenCalled();
	expect (gt.isAuthenticated()).toBeTruthy();
  });
  
  it("can can retreive a shopping list from Google", function () {
 	var spy = sinon.spy();
	// now we need a fake XHR server to represent the authentication server
	server.respondWith(	"POST", "https://accounts.google.com/o/oauth2/token",
                        [200, { "content-type": "application/json; charset=UTF-8" },
                        '{"access_token":"MY_STUB_ACCESS_TOKEN","expires_in":3920,"refresh_token":"MY_STUB_REFRESH_TOKEN"}']
					  );
					  
   //and one for the tasks
   server.respondWith(	"GET", "https://www.googleapis.com/tasks/v1/lists/@default/tasks?oauth_token=MY_STUB_ACCESS_TOKEN&prettyprint=false",
                        [200, { "content-type": "application/json; charset=UTF-8" },
                        tl]
					  );				  
					 
	var gt = window.GoogleTasks;   
	var shoppingList;
	gt.authenticate();
	server.respond();
	expect (gt.isAuthenticated()).toBeTruthy();
    gt.eventServer.on(gt.TASK_LIST_RETREIVED, function(sl){shoppingList = sl;});
	gt.retreiveTaskList();
	server.respond();
	expect (shoppingList).toBeDefined();
  });
  
  
   it("can parse the mock tasklist", function () {
   	var thislist = tl;
   	  var tasklist = jQuery.parseJSON(thislist);
	});
	
	it ("should raise an event when cannot authenticate ", function () {
		
		});
	it ("should raise an event when cannot get the shopping list ", function(){
	
	});	
	
});




var tl = '\
{\
 "kind": "tasks#tasks",\
 "etag": "\\"4I1JyCN_AcgBElJWYb7lv8jetTk/xnx8JAF-AwgNU5cDVK3VZb2dTuk\\"",\
 "items": [\
  {\
   "kind": "tasks#task",\
   "id": "MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjox",\
   "title": "item 1",\
   "updated": "2011-06-04T20:20:41.241Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjox",\
   "position": "00000000002147483647",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "id": "MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoy",\
   "title": "item 2",\
   "updated": "2011-06-04T20:20:43.818Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoy",\
   "position": "00000000003221225471",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "id": "MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoz",\
   "title": "item 3",\
   "updated": "2011-06-04T20:20:48.485Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjoz",\
   "position": "00000000003758096383",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "id": "MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjo0",\
   "title": "item 4",\
   "updated": "2011-06-04T20:24:12.520Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjo0",\
   "position": "00000000004026531839",\
   "status": "needsAction"\
  },{\
   "kind": "tasks#task",\
   "id": "MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjo1",\
   "title": "",\
   "updated": "2011-06-04T20:24:13.132Z",\
   "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6Mjo1",\
   "position": "00000000004160749567",\
   "status": "needsAction"\
  }\
 ]\
}\
';
