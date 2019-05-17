const ElementDetails = require('./element_details.js');

function _appTableRowSelector(appName) {
  return `#appsTable tr[name="${appName}"]`;
}

function _appTableRowElement(appName, elementSelector) {
  return new ElementDetails(
   _appTableRowSelector(appName) + ' ' + elementSelector,
    ElementDetails.TYPE.CSS
  );
}

exports.appTableRow = function(appName) {
  return new ElementDetails(
    _appTableRowSelector(appName),
    ElementDetails.TYPE.CSS
  );
};

exports.openCreateAppBtn = function() {
  return new ElementDetails('openCreateApp', ElementDetails.TYPE.ID);
};

exports.appTable = function() {
  return new ElementDetails('appsTable', ElementDetails.TYPE.ID);
};

exports.submitAppBtn = function() {
  return new ElementDetails('submitApp', ElementDetails.TYPE.ID);
};

exports.appNameInput = function() {
  return new ElementDetails('appName', ElementDetails.TYPE.ID);
};

exports.appSyslogUrlInput = function() {
  return new ElementDetails('appSyslogUrl', ElementDetails.TYPE.ID);
};

exports.openEditAppBtn = function(appName) {
  return _appTableRowElement(appName, '[name="openEditApp"]');
};

exports.openMoreOptionsBtn = function(appName) {
  return _appTableRowElement(appName, '[name="openMoreOptions"]');
};

exports.deleteAppBtn = function(appName) {
  return _appTableRowElement(appName, '[name="deleteApp"]');
};

exports.appLink = function(appName) {
  return _appTableRowElement(appName, '[name="appLink"]');
};
