/*
 * This class is used to store information about Fn forms that are on the Fn UI
 */
module.exports = class FormDetails {
  /*
   * @param attributes {Object} - a collection of FormAttributes which detail
   *        information about the form's fields
   */
  constructor(attributes) {
    this.attributes = attributes;
  }

  /*
   * Return the value of the name attribute
   */
  get name() {
    return this.attributes.name.value;
  }

  /*
   * Get a list of all the valid FormAttributes for the Fn Form
   *
   * @return {Array} - an array of FormAttributes for the form
   */
  getAttributes() {
    return Object.values(this.attributes).filter( (attribute) => {
      return attribute.value !== null;
    });
  }

  /*
   * Get a list of FormAttributes which can be edited
   *
   * This is used so that the Selenium tests don't try to edit fields that
   * cannot be edited
   *
   * @return {Array} - an array of FormAttributes of form fields which can be
   *         edited
   */
  getEditableAttributes() {
    return this.getAttributes().filter( (attribute) => {
      return attribute.isEditable;
    });
  }
};
