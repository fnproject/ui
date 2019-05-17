module.exports = class FormAttribute {
  constructor(value, elementId, isEditable=true) {
    this.value = value;
    this.elementId = elementId;
    this.isEditable = isEditable;
  }
};
