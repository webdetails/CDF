/**
 * ## The Autocomplete Component
 */
describe("The Autocomplete Component #", function() {

  var myDashboard = _.extend({}, Dashboards);
  myDashboard.addParameter('autocompleteTestParameter', 1);

  var autocompleteComponent = window.AutocompleteBoxComponent = new AutocompleteBoxComponent();
  $.extend(autocompleteComponent, {
    name: "autocompleteComponent",
    type: "AutoCompleteBoxComponent",
    htmlObject: 'autocompleteComponent',
    parameter: "autocompleteTestParameter",
    matchType: "fromStart",
    selectMulti: true,
    showApplyButton: true,
    minTextLength: 0,
    scrollHeight: 250,
    reloadOnUpdate:true,
    autoUpdateTimeout:3000,
    executeAtStart: true,
    autoUpdateFunction: function(){
      if(!autocompleteTestParameter){
        autocompleteTestParameter="";
      }
      var inputValue=$("#autoboxInput").val();
      if(autocompleteTestParameter!=inputValue){
        autocompleteTestParameter=inputValue;
        Dashboards.update(autocompleteComponent);
      }
    }
  });

  var $htmlObject = $('<div />').attr('id', autocompleteComponent.htmlObject);

  myDashboard.addComponent(autocompleteComponent);

  beforeEach(function() {
    $('body').append($htmlObject);
  });

  afterEach(function() {
    $htmlObject.remove();
  });

  /**
   * ## The Autocomplete Component # Update Called
   */
  it("Update Called", function(done){
    spyOn(autocompleteComponent, 'update').and.callThrough();
    myDashboard.update(autocompleteComponent);
    setTimeout(function(){
      expect(autocompleteComponent.update).toHaveBeenCalled();
      done();
    }, 100);
  });

  /**
   * ## The Autocomplete Component # List construction after autocomplete search
   */
  it("List construction after autocomplete search", function(done) {
    var expectedResult = [
      "AV Stores, Co.",
      "Anna's Decorations",
      "Auto Canal+ Petit"
    ];

    spyOn(autocompleteComponent, 'queryServer').and.callFake(function(searchString, successCallback) {
      successCallback([
        ["AV Stores, Co."],
        ["Anna's Decorations"],
        ["Auto Canal+ Petit"],
        ["Euro+ Shopping Channel"],
        ["La Rochelle Gifts"]
      ]);
    });

    var returnedList = [];
    autocompleteComponent.search({term:'a'}, function(list) {
      returnedList = list;
    });

    setTimeout(function(){
      expect(autocompleteComponent.queryServer).toHaveBeenCalled();
      expect(returnedList).toEqual(expectedResult);
      done();
    }, 100);
  });

  /**
   * ## The Autocomplete Component # Select and Remove Values
   */
  it("Select and Remove Values", function() {
    autocompleteComponent.selectedValues = [];

    autocompleteComponent.selectValue("value1");
    expect(autocompleteComponent.selectedValues).toEqual(["value1"]);

    autocompleteComponent.selectValue("value2");
    expect(autocompleteComponent.selectedValues).toEqual(["value1", "value2"]);

    autocompleteComponent.removeValue("value1");
    expect(autocompleteComponent.selectedValues).toEqual(["value2"]);

    autocompleteComponent.removeValue("value2");
    expect(autocompleteComponent.selectedValues).toEqual([]);
  });

  /**
   * ## The Autocomplete Component # Get Options
   */
  it("Get Options", function() {
    var options = autocompleteComponent.getOptions();

    expect(options.appendTo.attr("class")).toMatch('autocomplete-container');
    expect(options.minLength).toEqual(autocompleteComponent.minTextLength);
    expect(typeof options.source).toEqual('function');
    expect(typeof options.focus).toEqual('function');
    expect(typeof options.open).toEqual('function');
    expect(typeof options.close).toEqual('function');
  });
});

/**
 * ## The DateInput Component
 */
describe("The DateInput Component #", function() {

  var myDashboard = _.extend({}, Dashboards);
  var onOpen = false;
  var onClose = false;

  myDashboard.addParameter('dateInputTestParameter', "");

  var dateInputComponent = window.DateInputComponent = new DateInputComponent();
  $.extend(dateInputComponent, {
    name: "dateInputComponent",
    type: "dateInputComponent",
    htmlObject: 'dateInputComponent',
    parameter: "dateInputTestParameter",
    dateFormat: "yy-mm-dd",
    startDate: "2006-05-31",
    endDate: "TODAY",
    onOpenEvent: function() {
      onOpen = true;
    },
    onCloseEvent: function() {
      onClose = true;
    },
    executeAtStart: true
  });

  myDashboard.addComponent(dateInputComponent);


  /**
   * ## The DateInput Component # Update Called
   */
  it("Update Called", function(done) {
    spyOn(dateInputComponent, 'update').and.callThrough();
    myDashboard.update(dateInputComponent);
    setTimeout(function(){
      expect(dateInputComponent.update).toHaveBeenCalled();
      done();
    }, 100);
  });

  /**
   * ## The DateInput Component # Trigger onOpenEvent and onCloseEvent called
   */
  it("Trigger onOpenEvent and onCloseEvent called", function(done) {
    spyOn(dateInputComponent, 'update').and.callThrough();
    myDashboard.update(dateInputComponent);
    dateInputComponent.triggerOnOpen();
    dateInputComponent.triggerOnClose();

    setTimeout(function(){
      expect(dateInputComponent.update).toHaveBeenCalled();
      expect(onOpen).toBeTruthy();
      expect(onClose).toBeTruthy();
      done();
    }, 100);
  });
});


/**
 * ## The Radio Component
 */
describe("The Radio Component #", function(){
  var myDashboard = _.extend({}, Dashboards);
  myDashboard.addParameter('region', "");

  var radioComponent = window.RadioComponent = new RadioComponent();
  $.extend(radioComponent, {
    name: "radioComponent",
    type: "radioComponent",
    parameters:[],
    path: "/fake/regions.xaction",
    parameter: "region",
    separator: ",&nbsp;",
    valueAsId: true,
    htmlObject: "sampleObject",
    executeAtStart: true,
    postChange: function() {
      return "you chose: " + this.dashboard.getParameterValue(this.parameter);
    }
  });

  myDashboard.addComponent(radioComponent);
  /**
   * ## The Radio Component # allows a dashboard to execute update
   */
  it("allows a dashboard to execute update", function(done) {
    spyOn(radioComponent, 'update').and.callThrough();
    spyOn($, "ajax").and.callFake(function() {
      return {responseXML: "<test/>"};
    });

    // listen to cdf:postExecution event
    radioComponent.once("cdf:postExecution", function() {
      expect(radioComponent.update).toHaveBeenCalled();
      done();
    });

    myDashboard.update(radioComponent);
  });

  /**
   * ## The Radio Component # behaves correctly with parameter as null
   */
  it("behaves correctly with parameter as null", function(done) {
    myDashboard.setParameter("region", null);
    spyOn(radioComponent, 'update').and.callThrough();
    spyOn($, "ajax").and.callFake(function() {
      return {responseXML: "<test/>"};
    });

    // listen to cdf:postExecution event
    radioComponent.once("cdf:postExecution", function() {
      expect(radioComponent.update).toHaveBeenCalled();
      done();
    });

    myDashboard.update(radioComponent);
  });

  /**
   * ## The Radio Component # behaves correctly with parameter as undefined
   */
  it("behaves correctly with parameter as undefined", function(done) {
    myDashboard.setParameter("region", undefined);
    spyOn(radioComponent, 'update').and.callThrough();
    spyOn($, "ajax").and.callFake(function() {
      return {responseXML: "<test/>"};
    });

    // listen to cdf:postExecution event
    radioComponent.once("cdf:postExecution", function() {
      expect(radioComponent.update).toHaveBeenCalled();
      done();
    });

    myDashboard.update(radioComponent);
  });

});

/**
 * ## The Checkbox Component
 */
describe("The Checkbox Component #", function(){
  var myDashboard = _.extend({}, Dashboards);
  myDashboard.addParameter('region', "");

  var checkboxComponent = window.CheckComponent = new CheckComponent();
  $.extend(checkboxComponent, {
    name: "checkComponent",
    type: "checkComponent",
    parameters: [],
    path: "/fake/test.xaction",
    parameter: "region",
    separator: ",&nbsp;",
    valueAsId: true,
    htmlObject: "sampleObject",
    executeAtStart: true,
    postChange: function() { return; }
  });

  myDashboard.addComponent(checkboxComponent);

  /**
   * ## The Checkbox Component # allows a dashboard to execute update
   */
  it("allows a dashboard to execute update", function(done) {
    spyOn(checkboxComponent, 'update').and.callThrough();
    spyOn($, "ajax").and.callFake(function() {
      return {responseXML: "<test/>"};
    });

    // listen to cdf:postExecution event
    checkboxComponent.once("cdf:postExecution", function() {
      expect(checkboxComponent.update).toHaveBeenCalled();
      done();
    });

    myDashboard.update(checkboxComponent);
  });

  /**
   * ## The Checkbox Component # behaves correctly with parameter as null
   */
  it("behaves correctly with parameter as null", function(done) {
    myDashboard.setParameter("region", null);
    spyOn(checkboxComponent, 'update').and.callThrough();
    spyOn($, "ajax").and.callFake(function() {
      return {responseXML: "<test/>"};
    });

    // listen to cdf:postExecution event
    checkboxComponent.once("cdf:postExecution", function() {
      expect(checkboxComponent.update).toHaveBeenCalled();
      done();
    });

    myDashboard.update(checkboxComponent);
  });

  /**
   * ## The Checkbox Component # behaves correctly with parameter as undefined
   */
  it("behaves correctly with parameter as undefined", function(done) {
    myDashboard.setParameter("region", undefined);
    spyOn(checkboxComponent, 'update').and.callThrough();
    spyOn($, "ajax").and.callFake(function() {
      return {responseXML: "<test/>"};
    });

    // listen to cdf:postExecution event
    checkboxComponent.once("cdf:postExecution", function() {
      expect(checkboxComponent.update).toHaveBeenCalled();
      done();
    });

    myDashboard.update(checkboxComponent);
  })
});
