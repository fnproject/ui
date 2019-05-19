const AppPageSelector = require('./app_page_selector.js');
const FormAttribute = require('./form_attribute.js');
const FormDetails = require('./form_details.js');

/*
 * This class is used to edit/add Fn Functions using the create/edit Function
 * form on the Fn UI
 *
 * It contains a mapping of where to find the form field on the page and what
 * the value should be set to
 */
module.exports = class FnDetails extends FormDetails {
  /*
   * @param name {String} - the name of the Function
   * @param image {String} - the image the Function uses
   * @param memory {Integer} - the memory limit of the Function
   * @param timeout {Integet} - the timeout for the Function
   * @param idle_timeout {Integer} - the idle timeout for the Function
   */
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
