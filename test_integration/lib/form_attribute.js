const ElementDetails = require('./element_details.js');
const Exceptions = require('./exceptions.js');

module.exports = class FormAttribute {
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
