const ElementDetails = require('./element_details.js');

function _fnTableRowSelector(fnName) {
  return `#fnTable tr[name="${fnName}"]`;
}

function _fnTableRowElement(fnName, elementSelector) {
  return new ElementDetails(
   _fnTableRowSelector(fnName) + ' ' + elementSelector,
    ElementDetails.TYPE.CSS
  );
}

exports.fnTableRow = function(fnName) {
  return new ElementDetails(
    _fnTableRowSelector(fnName),
    ElementDetails.TYPE.CSS
  );
};

exports.openCreateFnBtn = function() {
  return new ElementDetails('openCreateFn', ElementDetails.TYPE.ID);
};

exports.fnTable = function() {
  return new ElementDetails('fnTable', ElementDetails.TYPE.ID);
};

exports.submitFnBtn = function() {
  return new ElementDetails('submitFn', ElementDetails.TYPE.ID);
};

exports.fnNameInput = function() {
  return new ElementDetails('fnName', ElementDetails.TYPE.ID);
};

exports.fnImageInput = function() {
  return new ElementDetails('fnImage', ElementDetails.TYPE.ID);
};

exports.fnMemoryInput = function() {
  return new ElementDetails('fnMemory', ElementDetails.TYPE.ID);
};

exports.fnTimeoutInput = function() {
  return new ElementDetails('fnTimeout', ElementDetails.TYPE.ID);
};

exports.fnIdleTimeoutInput = function() {
  return new ElementDetails('fnIdleTimeout', ElementDetails.TYPE.ID);
};

exports.openEditFnBtn = function(fnName) {
  return _fnTableRowElement(fnName, '[name="openEditFn"]');
};

exports.openMoreOptionsBtn = function(fnName) {
  return _fnTableRowElement(fnName, '[name="openMoreOptions"]');
};

exports.deleteFnBtn = function(fnName) {
  return _fnTableRowElement(fnName, '[name="deleteFn"]');
};
