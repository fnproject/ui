const ElementDetails = require('./element_details.js');
const Exceptions = require('./exceptions.js');

/*
 * A class that encapsulates information about the UIs form fields such as
 * if it's allowed to be edited and how to locate the form field on the page
 * and the value we want it to contain
 */
module.exports = class FormAttribute {
  /*
   * @param {String} value - the value of the form field e.g. fnproject/hello
   *        for the fn image's name
   * @param {ElementDetails} elementDetails - an instance of ElementDetails
   *        information about the element such as its location on the page
   * @param {bool} isEditable - whether it's possible to update the field once
   *        it's been created
   */
  constructor(value, elementDetails, isEditable=true) {
    this.value = value;
    this.isEditable = isEditable;

    if (elementDetails.type !== ElementDetails.TYPE.ID) {
      throw new Exceptions.UnimplementedError(
        `Unimplemented element type: ${elementDetails.type} for ` +
        `${elementDetails.selector}. FormAttribute only supports element IDs`
      );
    }

    this.elementId = elementDetails.selector;
  }
};
