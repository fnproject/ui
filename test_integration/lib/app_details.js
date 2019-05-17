const FormAttribute = require('./form_attribute.js');
const FormDetails = require('./form_details.js');

module.exports = class AppDetails extends FormDetails {
  constructor(name, syslogUrl=null) {
    super({
      name: new FormAttribute(name, 'appName', false),
      image: new FormAttribute(syslogUrl, 'appSyslogUrl'),
    });
  }
};
