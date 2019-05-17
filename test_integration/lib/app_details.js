const FormAttribute = require('./form_attribute.js');
const FormDetails = require('./form_details.js');
const HomepageSelector = require('./homepage_selector.js');

module.exports = class AppDetails extends FormDetails {
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
