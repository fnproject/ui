const AppPageSelector = require('./app_page_selector.js');
const FormAttribute = require('./form_attribute.js');
const FormDetails = require('./form_details.js');

module.exports = class FnDetails extends FormDetails {
  constructor(name, image, memory=null, timeout=null, idle_timeout=null) {
    super({
      name: new FormAttribute(
        name, AppPageSelector.fnNameInput(), false
      ),
      image: new FormAttribute(
        image, AppPageSelector.fnImageInput()
      ),
      memory: new FormAttribute(
        memory, AppPageSelector.fnMemoryInput()
      ),
      timeout: new FormAttribute(
        timeout, AppPageSelector.fnTimeoutInput()
      ),
      idle_timeout: new FormAttribute(
        idle_timeout, AppPageSelector.fnIdleTimeoutInput()
      ),
    });
  }
};
