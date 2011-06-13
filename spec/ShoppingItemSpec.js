/**
 * @author mazda
 */
describe("ShoppingItem", function() {
  it("when it is created it is not done", function() {
    var s = new ShoppingItem();
	expect (s.isComplete()).toEqual(false);
  });
  
  it("when it is created we need 1", function() {
    var s = new ShoppingItem();
	expect (s.getHowManyNeeded()).toEqual(1);
  });
  
  it("when it is created it has an empty item name", function() {
    var s = new ShoppingItem();
	expect (s.getItemName()).toEqual("");
  });
  
  it("when it is completed it should remember the number needed", function() {
  	var s = new ShoppingItem();
	s.setHowManyNeeded(2);
	s.setComplete(true);
	s.setComplete(false);
	expect (s.getHowManyNeeded()).toEqual(2);
  });
  
  it("should serialise to the Google Task JSON message format", function(){
  	var s = new ShoppingItem();
	var internalTask = s.toJSON();
	var myJSON = {id: "taskID",
  					kind: "tasks#task",
  					selfLink: "",
  					etag: "",
  					title: "",
  					notes: "get 1",
  					updated: s.getUpdatedDateTime().format("isoUtcDateTime"),
  					due: "",
  					position: "",
  					hidden: "false",
  					status: "incomplete",
  					deleted: "false",
					};
	
	expect(myJSON).toEqual(JSON.parse(internalTask));
  });
  
  it("when any field is changed the lastUpdated time is updated", function(){
		spec = this;
		spec.si = new ShoppingItem();
		spec.sDate = this.si.getUpdatedDateTime();
	    waits(1000);	
	    runs(function () {
			spec.si.setComplete(true);
			expect(spec.si.getUpdatedDateTime()).toBeGreaterThan(spec.sDate);
		});
    });
});