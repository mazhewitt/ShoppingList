/**
 * @author mazda
 */
describe("GoogleTasksAPI", function() {

    var localStorage_get;
    var localStorage_set;
    var fakeserver;

    beforeEach(function() {
        // Refresh Key is held in local storage - so let's stub that
        localStorage_get = sinon.stub(localStorage, "getItem");
        localStorage_set = sinon.stub(localStorage, "setItem");
        localStorage_get.withArgs("GoogleRefreshKey").returns("STUBBED_REFRESH_KEY");
        // now let's repalce the XHR server so we can mock up Google
        fakeserver = sinon.fakeServer.create();
    });

    afterEach(function() {
        localStorage_get.restore();
        localStorage_set.restore();
        fakeserver.restore();
    });


    it("can authenticate with google when refresh key is in local storage", function() {
        var spy = sinon.spy();
        // now we need a fake XHR server to represent the authentication server
        GoogleTasksSpecHelper.setupFakeSuccessfulAuthServer(fakeserver);
        var gt = window.GoogleTasks;
        gt.eventServer.on(gt.ACCESS_TOKEN_REFRESHED_EVENT, spy);
        gt.authenticate();
        fakeserver.respond();
        expect(spy).toHaveBeenCalled();
        expect(gt.isAuthenticated()).toBeTruthy();
    });

    it("can can retreive a task list from Google", function() {
        GoogleTasksSpecHelper.setupFakeSuccessfulAuthServer(fakeserver);
        GoogleTasksSpecHelper.setupFakeSuccessfulTaskServer(fakeserver, tl);
        var gt = window.GoogleTasks;
        var taskList;
        gt.authenticate();
        fakeserver.respond();
        expect(gt.isAuthenticated()).toBeTruthy();
        gt.eventServer.on(gt.TASK_LIST_RETREIVED, function(tl) {
            taskList = tl;
        });
        gt.retreiveTaskList();
        fakeserver.respond();
        expect(taskList).toBeDefined();
    });


    it("can parse the mock tasklist", function() {
        var thislist = GoogleTasksSpecHelper.tl;
        var tasklist = jQuery.parseJSON(thislist);
        expect(tasklist).toBeDefined();
    });

    it("should raise an event when cannot authenticate ", function() {
        var spy = sinon.spy();
        GoogleTasksSpecHelper.setupFakeFailingAuthServer(fakeserver);
        var gt = window.GoogleTasks;
        gt.eventServer.on(gt.AUTH_ERROR_EVENT, spy);
        gt.authenticate(); 
        fakeserver.respond();
        expect(spy).toHaveBeenCalled();
        expect(gt.isAuthenticated()).toBeFalsy();
    });

    it("should raise an event when cannot get the shopping list ", function() {
        var spy = sinon.spy();
        GoogleTasksSpecHelper.setupFakeSuccessfulAuthServer(fakeserver);
        GoogleTasksSpecHelper.setupFakeFailingTaskServer(fakeserver);
        var gt = window.GoogleTasks;
        gt.authenticate();
        fakeserver.respond();
        expect(gt.isAuthenticated()).toBeTruthy();
        gt.eventServer.on(gt.GOOGLE_TASKS_ERROR_EVENT, spy);
        gt.retreiveTaskList();
        fakeserver.respond();
        expect(spy).toHaveBeenCalled();
    });

    it("can update a single item in the google task list", function() {
        expect(1).toEqual(2);
    });

    it("can delete a task item", function() {
        expect(1).toEqual(2);
    });

    it("can add a task item", function() {
        GoogleTasksSpecHelper.setupFakeSuccessfulAuthServer(fakeserver);
        GoogleTasksSpecHelper.setupFakeSuccessfulTaskServer(fakeserver, tl);
        var gt = window.GoogleTasks;
        gt.authenticate();
        fakeserver.respond();
        expect(gt.isAuthenticated()).toBeTruthy();
        var newTask = {
            "title": "Test Task",
            "notes": "Some Notes",
            "status": "",
            "due": "",
            "completed": false
        };
        gt.insert(newTask);
        fakeserver.respond();
        gt.eventServer.on(gt.TASK_INSERTED, spy);
        expect(spy).toHaveBeenCalled();
    });


});

var GoogleTasksSpecHelper = {


    setupFakeSuccessfulAuthServer: function(fakeserver) {
        fakeserver.respondWith("POST", "https://accounts.google.com/o/oauth2/token", [200,
        {
            "content-type": "application/json; charset=UTF-8"
        }, '{"access_token":"MY_STUB_ACCESS_TOKEN","expires_in":3920,"refresh_token":"MY_STUB_REFRESH_TOKEN"}']);
    },
    setupFakeSuccessfulTaskServer: function(fakeserver, tasklist) {
        fakeserver.respondWith("GET", "https://www.googleapis.com/tasks/v1/lists/@default/tasks?oauth_token=MY_STUB_ACCESS_TOKEN&prettyprint=false", [200,
        {
            "content-type": "application/json; charset=UTF-8"
        },
        tasklist]);
    },
    setupFakeFailingTaskServer: function(fakeserver) {
        fakeserver.respondWith("GET", "https://www.googleapis.com/tasks/v1/lists/@default/tasks?oauth_token=MY_STUB_ACCESS_TOKEN&prettyprint=false", [400,
        {
            "content-type": "application/json; charset=UTF-8"
        }, ""]);
    },
    setupFakeFailingAuthServer: function(fakeserver) {
        // now we need a fake XHR server to represent the authentication server
        fakeserver.respondWith("POST", "https://accounts.google.com/o/oauth2/token", [400,
        {
            "content-type": "application/json; charset=UTF-8"
        }, '']);

    }


};

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