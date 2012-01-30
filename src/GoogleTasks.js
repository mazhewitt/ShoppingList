/**
 * @author mazda
 * 
Client ID:	
256653011780.apps.googleusercontent.com
Client secret:	
R14-a9fiYWMx6PwXvxec_hlN
Redirect URIs:	urn:ietf:wg:oauth:2.0:oob
4/sLcLFEN7pJyJhbBSo3S5PHy9NhwB
 */

window.GoogleTasks = function (){
	var clientId = "256653011780-48r7f2vksc3a1kr7s66sig0i5brph5je.apps.googleusercontent.com";
    var clientSecret = "sP3tcGFQP2r5tqwW7K_eIaj1";

    // Or your redirect URL for web based applications.
    var redirectUrl "http://c9.io/mazhewitt/shoppinglist/workspace/test.html";
    var scope = "https://www.googleapis.com/auth/tasks";
	var access_token = "";
	var refresh_token = "";
	var authenticated = false;
	var shoppingListName = "@default";
	var eventServer = new EventEmitter();
	var ACCESS_TOKEN_REFRESHED_EVENT = "GoogleTasks.ACCESS_TOKEN_REFRESHED";
	var TASK_LIST_RETREIVED = "GoogleTasks.TASK_LIST_RETREIVED";
	var AUTH_ERROR_EVENT = "GoogleTasks.AUTH_ERROR_EVENT";
	var GOOGLE_TASKS_ERROR_EVENT = "GoogleTasks.GOOGLE_TASKS_ERROR_EVENT";
    var TASK_INSERTED  = "GoogleTasks.TASK_INSERTED";
    var TASK_UPDATED  = "GoogleTasks.TASK_UPDATED";
    var TASK_DELETED  = "GoogleTasks.TASK_DELETED";
	var kind= "tasks#task";
    
    
     $.support.cors = true;
	
	var setTokens_fromAJAX = function(data, textStatus, jqXHR){
		if (jqXHR.status == 200){
			access_token = data.access_token;
			refresh_token = data.refresh_token;
			localStorage.setItem("GoogleRefreshKey", refresh_token);
			console.log("got refresh token: " + refresh_token);
			authenticated = true;
			eventServer.emit(ACCESS_TOKEN_REFRESHED_EVENT);
		}
		else{
			authError(data, textStatus, jqXHR);
		}
	};
	
	var refreshAccessTokenByAJAX = function(data, textStatus, jqXHR){
		if (jqXHR.status == 200){
			access_token = data.access_token;
			authenticated = true;
			console.log("got aceess token: " + refresh_token);
			eventServer.emit(ACCESS_TOKEN_REFRESHED_EVENT);
		}
		else{
			authError(data, textStatus, jqXHR);
		}
		
	};
	
	var authError = function(jqXHR, textStatus, errorThrown){
		authenticated = false;
	    console.log("ERROR while authenticating: " + textStatus+ " "+ errorThrown);
		eventServer.emit(AUTH_ERROR_EVENT);
	};
	
	var tasksError = function(jqXHR, textStatus, errorThrown){
		authenticated = false;
	    console.log("ERROR while getting task list: " + textStatus+ " "+ errorThrown);
		eventServer.emit(GOOGLE_TASKS_ERROR_EVENT);
	};
	
	
	var retreiveTaskListByAJAX = function(data){
		console.log("TASK LIST\n------------------------\n\n"+JSON.stringify(data));
		eventServer.emit(TASK_LIST_RETREIVED, data);
	};
	
	var checkTaskList= function(jqXHR, textStatus){
		console.log("TASK LIST FINISHED "+textStatus);
	};
    
	var authenticate = function(){
		var storedRefreshToken = localStorage.getItem("GoogleRefreshKey");
		if (storedRefreshToken != undefined) {
			refresh_token = storedRefreshToken;
			refreshAccessToken();
		}
		else {
			var authorizationUrl = "https://accounts.google.com/o/oauth2/auth?client_id=" + clientId + "&redirect_uri=" + redirectUrl + "&scope=" + scope + "&response_type=code";
			console.log("Authorisation URL=" + authorizationUrl);
			// TODO = put part where we get the code from google authentication here (need to pop up window)
			var data = {
				code: "4/VgBMa05qnEYqK4gxo2K2NUSB42Mp",
				client_id: clientId,
				client_secret: clientSecret,
				redirect_uri: redirectUrl,
				grant_type: "authorization_code"
			};
			var gt = this;
			$.ajax({
				url: "https://accounts.google.com/o/oauth2/token",
				type: "POST",
				dataType: 'json',
				data: data,
				success: setTokens_fromAJAX,
				error: authError
			});
		}
		return false;
	};
	
	var refreshAccessToken = function (){
			var data = {
			refresh_token:refresh_token,
			client_id: clientId,
			client_secret: clientSecret,
			grant_type:"refresh_token"
		};
		$.ajax({
	  		url: "https://accounts.google.com/o/oauth2/token",
			type: "POST",
	  		dataType: 'json',
	  		data: data,
	  		success: refreshAccessTokenByAJAX,
			error: authError
		});
		return false;
	};
	
	var isAuthenticated = function (){
		return authenticated;
	};
	
	var retreiveTaskList = function(){
		var data = {
			oauth_token: access_token,
			prettyprint: false
		};
		var url = "https://www.googleapis.com/tasks/v1/lists/"+shoppingListName+"/tasks";
		$.ajax({
	  		url: url,
			type: "GET",
	  		dataType: 'json',
	  		data: data,
	  		success: retreiveTaskListByAJAX,
			complete: checkTaskList,
			error:  tasksError
		});
		return false;
	};
	
    var taskInserted = function(data, textStatus, jqXHR){
        if (jqXHR.status == 200){
			eventServer.emit(TASK_INSERTED, data);
		}
		else{
			tasksError(data, textStatus, jqXHR);
		}
    };
    
    var taskUpdated = function(data, textStatus, jqXHR){
        if (jqXHR.status == 200){
    		eventServer.emit(TASK_UPDATED, data);
		}
		else{
			tasksError(data, textStatus, jqXHR);
		}
    };
    
    var taskDeleted = function(data, textStatus, jqXHR){
        if (jqXHR.status == 200){
        	eventServer.emit(TASK_DELETED);
		}
		else{
			tasksError(data, textStatus, jqXHR);
		}
    };
    
    
    var insertTask = function(task){
		var url = "https://www.googleapis.com/tasks/v1/lists/"+shoppingListName+"/tasks";
		$.ajax({
	  		url: url,
			type: "POST",
	  		dataType: 'json',
            headers: {
                Authorization: access_token
            },
	  		data: task,
	  		success: taskInserted,
			error:  tasksError
		});
		return false;
    };
    
    var updateTask = function(task){
    	var url = "https://www.googleapis.com/tasks/v1/lists/"+shoppingListName+"/tasks/"+task.id;
		$.ajax({
	  		url: url,
			type: "PUT",
	  		dataType: 'json',
            headers: {
                Authorization: access_token
            },
	  		data: task,
	  		success: taskUpdated,
			error:  tasksError
		});
		return false;
    };
    
    var deleteTask = function(task){
        var url = "https://www.googleapis.com/tasks/v1/lists/"+shoppingListName+"/tasks/"+task.id;
		$.ajax({
	  		url: url,
			type: "DELETE",
	  		dataType: 'json',
            headers: {
                Authorization: access_token
            },
	  		data: task,
	  		success: taskDeleted,
			error:  tasksError
		});
		return false;
    };

	return{  // return public API
		ACCESS_TOKEN_REFRESHED_EVENT: ACCESS_TOKEN_REFRESHED_EVENT,
		TASK_LIST_RETREIVED: TASK_LIST_RETREIVED,
		AUTH_ERROR_EVENT: AUTH_ERROR_EVENT,
		GOOGLE_TASKS_ERROR_EVENT: GOOGLE_TASKS_ERROR_EVENT,
        TASK_INSERTED: TASK_INSERTED,
        TASK_UPDATED: TASK_UPDATED,
        TASK_DELETED: TASK_DELETED,
		authenticate: authenticate,
		refreshAccessToken: refreshAccessToken,
		isAuthenticated: isAuthenticated,
		eventServer: eventServer,
		retreiveTaskList: retreiveTaskList,
        insertTask: insertTask,
        updateTask: updateTask,
        deleteTask: deleteTask
	};	
	
}();



