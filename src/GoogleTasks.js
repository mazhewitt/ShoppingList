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


function GoogleTasks(){
	this.clientId = "256653011780.apps.googleusercontent.com";
    this.clientSecret = "R14-a9fiYWMx6PwXvxec_hlN";

    // Or your redirect URL for web based applications.
    this.redirectUrl = "urn:ietf:wg:oauth:2.0:oob";
    this.scope = "https://www.googleapis.com/auth/tasks";
	this.access_token = "";
	this.refresh_token = "";
}



GoogleTasks.prototype.authenticate = function(success){
	var storedRefreshToken = localStorage.getItem("GoogleRefreshKey");
	if (storedRefreshToken != undefined) {
		this.refresh_token = storedRefreshToken;
		this.refreshAccessToken(success);
	}
	else {
		var authorizationUrl = "https://accounts.google.com/o/oauth2/auth?client_id=" + this.clientId + "&redirect_uri=" + this.redirectUrl + "&scope=" + this.scope + "&response_type=code";
		console.log("Authorisation URL=" + authorizationUrl);
		// TODO = put part where we get the code from google authentication here (need to pop up window)
		var data = {
			code: "4/CIHw7LwXeHQSkuT49nnK3QNCL9Lq",
			client_id: this.clientId,
			client_secret: this.clientSecret,
			redirect_uri: this.redirectUrl,
			grant_type: "authorization_code"
		};
		var gt = this;
		$.ajax({
			url: "https://accounts.google.com/o/oauth2/token",
			type: "POST",
			dataType: 'json',
			data: data,
			success: function(data){
				gt.access_token = data.access_token;
				gt.refresh_token = data.refresh_token;
				localStorage.setItem("GoogleRefreshKey", this.refresh_token);
				console.log("got refresh token: " + this.refresh_token);
				success();
			}
		});
	}
	return false;
};

GoogleTasks.prototype.refreshAccessToken = function(success){
		var data = {
		refresh_token:this.refresh_token,
		client_id: this.clientId,
		client_secret: this.clientSecret,
		grant_type:"refresh_token"
	};
	var gt = this;
	$.ajax({
  		url: "https://accounts.google.com/o/oauth2/token",
		type: "POST",
  		dataType: 'json',
  		data: data,
  		success: function(data){
			gt.access_token = data.access_token;
			console.log("got aceess token: " + gt.refresh_token);
			success();
		}
	});
	return false;
	
}

GoogleTasks.prototype.isAuthenticated = function(){
	
};