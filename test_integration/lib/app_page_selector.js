const ElementDetails = require('./element_details.js');

/*
 * This module contains information about how to find elements on the Fn UI's
 * App Details page
 */

// Return the CSS selector for the table row which contains information about
// the specified Function
function _fnTableRowSelector(fnName) {
  return `#fnTable tr[name="${fnName}"]`;
}

// Helper function for HTML elements which are located in the Functions table.
// It appends the element's selector to the end of the Fn Table row selector
function _fnTableRowElement(fnName, elementSelector) {
  return new ElementDetails(
   _fnTableRowSelector(fnName) + ' ' + elementSelector,
    ElementDetails.TYPE.CSS
  );
}

// Return information on how to find the Function's row in the Fn Table
exports.fnTableRow = function(fnName) {
  return new ElementDetails(
    _fnTableRowSelector(fnName),
    ElementDetails.TYPE.CSS
  );
};

// Return information on how to find the openCreateFn button
exports.openCreateFnBtn = function() {
  return new ElementDetails('openCreateFn', ElementDetails.TYPE.ID);
};

// Return information on how to find the Functions table
exports.fnTable = function() {
  return new ElementDetails('fnTable', ElementDetails.TYPE.ID);
};

// Return information on how to find the create/edit Function submit button
exports.submitFnBtn = function() {
  return new ElementDetails('submitFn', ElementDetails.TYPE.ID);
};

// Return information on how to find the fn name input field
exports.fnNameInput = function() {
  return new ElementDetails('fnName', ElementDetails.TYPE.ID);
};

// Return information on how to find the fn image input field
exports.fnImageInput = function() {
  return new ElementDetails('fnImage', ElementDetails.TYPE.ID);
};

// Return information on how to find the fn memory input field
exports.fnMemoryInput = function() {
  return new ElementDetails('fnMemory', ElementDetails.TYPE.ID);
};

// Return information on how to find the fn timeout input field
exports.fnTimeoutInput = function() {
  return new ElementDetails('fnTimeout', ElementDetails.TYPE.ID);
};

// Return information on how to find the fn idle timeout input field
exports.fnIdleTimeoutInput = function() {
  return new ElementDetails('fnIdleTimeout', ElementDetails.TYPE.ID);
};

// Return information on how to find the edit Fn button
exports.openEditFnBtn = function(fnName) {
  return _fnTableRowElement(fnName, '[name="openEditFn"]');
};

// Return information on how to find the Fn more options button
exports.openMoreOptionsBtn = function(fnName) {
  return _fnTableRowElement(fnName, '[name="openMoreOptions"]');
};

// Return information on how to find the delete Fn button
exports.deleteFnBtn = function(fnName) {
  return _fnTableRowElement(fnName, '[name="deleteFn"]');
};
