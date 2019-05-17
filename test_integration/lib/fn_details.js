const FormAttribute = require('./form_attribute.js');
const FormDetails = require('./form_details.js');

module.exports = class FnDetails extends FormDetails {
  constructor(name, image, memory=null, timeout=null, idle_timeout=null) {
    super({
      name: new FormAttribute(name, 'fnName', false),
      image: new FormAttribute(image, 'fnImage'),
      memory: new FormAttribute(memory, 'fnMemory'),
      timeout: new FormAttribute(timeout, 'fnTimeout'),
      idle_timeout: new FormAttribute(idle_timeout, 'fnIdleTimeout'),
    });
  }
};
