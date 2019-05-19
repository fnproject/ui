const FormAttribute = require('./form_attribute.js');
const FormDetails = require('./form_details.js');
const HomepageSelector = require('./homepage_selector.js');

/*
 * This class is used to edit/add Fn Apps using the create/edit App form
 * on the Fn UI
 *
 * It contains a mapping of where to find the form field on the page and what
 * the value should be set to
 */
module.exports = class AppDetails extends FormDetails {
  /*
   * @param name {String} - the name of the App
   * @param syslogUrl {String} - the syslog URL for the app
   */
  constructor(name, syslogUrl=null) {
    super({
      name: new FormAttribute(
        name, HomepageSelector.appNameInput(), false
      ),
      syslog_url: new FormAttribute(
        syslogUrl, HomepageSelector.appSyslogUrlInput()
      ),
    });
  }
};
