/**
 * @author mazda
 */
 


 var GoogleTasksSpecHelper = {


    setupFakeSuccessfulAuthServer: function(fakeserver) {
        fakeserver.respondWith("POST", "https://accounts.google.com/o/oauth2/token", [200,
        {
            "content-type": "application/json; charset=UTF-8"
        }, '{"access_token":"MY_STUB_ACCESS_TOKEN","expires_in":3920,"refresh_token":"MY_STUB_REFRESH_TOKEN"}']);
    },
    setupFakeSuccessfulTaskListServer: function(fakeserver, tasklist) {
        fakeserver.respondWith("GET", "https://www.googleapis.com/tasks/v1/lists/@default/tasks?oauth_token=MY_STUB_ACCESS_TOKEN&prettyprint=false", [200,
        {
            "content-type": "application/json; charset=UTF-8"
        },
        tasklist]);
    },
    setupFakeFailingTaskListServer: function(fakeserver) {
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

    },
    setupFakeSuccessfulTaskServer: function(fakeserver, task) {
        fakeserver.respondWith("POST", "https://www.googleapis.com/tasks/v1/lists/@default/tasks", [200,
        {
            "content-type": "application/json; charset=UTF-8"
        },      task]);
        
        var taskObj = jQuery.parseJSON(task);
        
        fakeserver.respondWith("DELETE", "https://www.googleapis.com/tasks/v1/lists/@default/tasks/"+taskObj.id, [200,
        {
            "content-type": "application/json; charset=UTF-8"
        },      '']);
        
        fakeserver.respondWith("PUT", "https://www.googleapis.com/tasks/v1/lists/@default/tasks/"+taskObj.id, [200,
        {
            "content-type": "application/json; charset=UTF-8"
        },      '']);
    }
};
 
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
        GoogleTasksSpecHelper.setupFakeSuccessfulTaskListServer(fakeserver, tl);
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
        var thislist = tl;
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
        GoogleTasksSpecHelper.setupFakeFailingTaskListServer(fakeserver);
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
        GoogleTasksSpecHelper.setupFakeSuccessfulAuthServer(fakeserver);
        GoogleTasksSpecHelper.setupFakeSuccessfulTaskServer(fakeserver, testTask);
        var gt = window.GoogleTasks;
        gt.authenticate();
        fakeserver.respond();
        expect(gt.isAuthenticated()).toBeTruthy();
        
        var newTask = {
            title: "Pork Chops",
            notes: "Get 20"
        };
        var responseTask;
        gt.eventServer.on(gt.TASK_INSERTED, function(data){
            responseTask = data;
        });
        gt.insertTask(newTask);
        fakeserver.respond();
        expect(responseTask.title).toEqual(newTask.title);
        expect(responseTask.updated).toBeDefined
        
        GoogleTasksSpecHelper.setupFakeSuccessfulTaskServer(fakeserver, updateTask);
        var taskToUpdate = responseTask;
        taskToUpdate.notes = "get 40";
        gt.eventServer.on(gt.TASK_UPDATED, function(data){
            responseTask = data;
        });
        gt.updateTask(taskToUpdate);
  
        fakeserver.respond();
        expect(responseTask.title).toEqual(taskToUpdate.title);
        expect(responseTask.notes).toEqual("get 40");
    });

    it("can delete a task item", function() {
        GoogleTasksSpecHelper.setupFakeSuccessfulAuthServer(fakeserver);
        GoogleTasksSpecHelper.setupFakeSuccessfulTaskServer(fakeserver, testTask);
        var gt = window.GoogleTasks;
        gt.authenticate();
        fakeserver.respond();
        expect(gt.isAuthenticated()).toBeTruthy();
        
        var newTask = {
            title: "Pork Chops",
            notes: "Get 20"
        };
        var responseTask;
        gt.eventServer.on(gt.TASK_INSERTED, function(data){
            responseTask = data;
        });
        gt.insertTask(newTask);
        fakeserver.respond();
        expect(responseTask.title).toEqual(newTask.title);
        expect(responseTask.updated).toBeDefined
        
        
        var spy = sinon.spy();
        gt.eventServer.on(gt.TASK_DELETED, spy); 
        gt.deleteTask(responseTask);
        fakeserver.respond();
        expect(spy).toHaveBeenCalled();
        
    });

    it("can add a task item", function() {
        GoogleTasksSpecHelper.setupFakeSuccessfulAuthServer(fakeserver);
        GoogleTasksSpecHelper.setupFakeSuccessfulTaskServer(fakeserver, testTask);
        var gt = window.GoogleTasks;
        gt.authenticate();
        fakeserver.respond();
        expect(gt.isAuthenticated()).toBeTruthy();
        var newTask = {
            title: "Pork Chops",
            notes: "Get 20"
        };
        var responseTask;
        gt.eventServer.on(gt.TASK_INSERTED, function(data){
            responseTask = data;
        });
        gt.insertTask(newTask);
        fakeserver.respond();
        expect(responseTask.title).toEqual(newTask.title);
        expect(responseTask.updated).toBeDefined();
    });


});

var testTask = '\
{\
 "kind": "tasks#task",\
 "id": "MDQ0MjgwNjg1MDI3MjgyMzA1NDk6MDoxMzAyOTUwNTc1",\
 "etag": "\\"Eb0IVTIf8nvTXDAzt6s5r2fCyaI/LTk2NTg0MjkyOA\\"",\
 "title": "Pork Chops",\
 "updated": "2012-01-06T13:29:57.000Z",\
 "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6MDow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6MDoxMzAyOTUwNTc1",\
 "position": "00000000000025873296",\
 "notes": "Get 20",\
 "status": "needsAction"\
}';

var updateTask = '\
{\
 "kind": "tasks#task",\
 "id": "MDQ0MjgwNjg1MDI3MjgyMzA1NDk6MDoxMzAyOTUwNTc1",\
 "etag": "\\"Eb0IVTIf8nvTXDAzt6s5r2fCyaI/LTk2NTg0MjkyOA\\"",\
 "title": "Pork Chops",\
 "updated": "2012-01-06T13:29:57.000Z",\
 "selfLink": "https://www.googleapis.com/tasks/v1/lists/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6MDow/tasks/MDQ0MjgwNjg1MDI3MjgyMzA1NDk6MDoxMzAyOTUwNTc1",\
 "position": "00000000000025873296",\
 "notes": "Get 40",\
 "status": "needsAction"\
}';


var    tl= '\
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