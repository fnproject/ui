const ElementDetails = require('./element_details.js');

/*
 * This module contains information about how to find elements on the Fn UI's
 * Homepage
 */

// Return the CSS selector for the table row which contains information about
// the specified App
function _appTableRowSelector(appName) {
  return `#appsTable tr[name="${appName}"]`;
}

// Helper function for HTML elements which are located in the Apps table.
// It appends the element's selector to the end of the App Table row selector
function _appTableRowElement(appName, elementSelector) {
  return new ElementDetails(
   _appTableRowSelector(appName) + ' ' + elementSelector,
    ElementDetails.TYPE.CSS
  );
}

// Return information on how to find the App's row in the Apps table
exports.appTableRow = function(appName) {
  return new ElementDetails(
    _appTableRowSelector(appName),
    ElementDetails.TYPE.CSS
  );
};

// Return information on how to find the CreateApp button
exports.openCreateAppBtn = function() {
  return new ElementDetails('openCreateApp', ElementDetails.TYPE.ID);
};

// Return information on how to find the Apps table
exports.appTable = function() {
  return new ElementDetails('appsTable', ElementDetails.TYPE.ID);
};

// Return information on how to find the create/edit App submit button
exports.submitAppBtn = function() {
  return new ElementDetails('submitApp', ElementDetails.TYPE.ID);
};

// Return information on how to find the App Name input field
exports.appNameInput = function() {
  return new ElementDetails('appName', ElementDetails.TYPE.ID);
};

// Return information on how to find the Syslog URL input field
exports.appSyslogUrlInput = function() {
  return new ElementDetails('appSyslogUrl', ElementDetails.TYPE.ID);
};

// Return information on how to find the edit App button
exports.openEditAppBtn = function(appName) {
  return _appTableRowElement(appName, '[name="openEditApp"]');
};

// Return information on how to find the App more options button
exports.openMoreOptionsBtn = function(appName) {
  return _appTableRowElement(appName, '[name="openMoreOptions"]');
};

// Return information on how to find the delete App button
exports.deleteAppBtn = function(appName) {
  return _appTableRowElement(appName, '[name="deleteApp"]');
};

// Return information on how to find the link to the App's details page
exports.appLink = function(appName) {
  return _appTableRowElement(appName, '[name="appLink"]');
};
