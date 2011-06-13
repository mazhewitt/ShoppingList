/**
 * @author mazda
 */

function ShoppingItem(name, num){
	if (name == undefined){
		name = "";
	}
	if (num == undefined){
		num = 1;
	}
	this.myTask = {
  					id: "taskID",
  					kind: "tasks#task",
  					selfLink: "",
  					etag: "",
  					title: name,
  					notes: "get "+ num,
  					updated: getNowString(),
  					due: "",
  					position: "",
  					hidden: "false",
  					status: "incomplete",
  					deleted: "false"
	};
}

ShoppingItem.prototype.isComplete = function(){
	return this.myTask.status === "complete";
}
ShoppingItem.prototype.setComplete = function(c){
	this.updateTime();
	if(c == true){
		this.myTask.status = "complete";
	}
	else{
		this.myTask.status = "incomplete";
	}
}
ShoppingItem.prototype.getHowManyNeeded = function(){
	var num = this.myTask.notes.match(/get (\d+)/i);
	if (num[1] != null) {
		return parseInt(num[1]);
	}
	else return 1;
}
ShoppingItem.prototype.setHowManyNeeded = function(hm){
	this.updateTime();
	this.myTask.notes = "get "+ hm;
}
ShoppingItem.prototype.getItemName = function(){
    return this.myTask.title;
}
ShoppingItem.prototype.setItemName = function(inx){
	this.updateTime();
	this.myTask.title = inx;
}
ShoppingItem.prototype.toJSON = function(){
	return JSON.stringify(this.myTask);
}
ShoppingItem.prototype.updateTime = function(){
	this.myTask.updated = getNowString();
}
ShoppingItem.prototype.getUpdatedDateTime = function(){
	return new Date(this.myTask.updated);
}
function getNowString(){
  	var now = new Date();
	return now.format("isoUtcDateTime");
}
