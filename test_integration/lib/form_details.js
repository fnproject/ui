module.exports = class FormDetails {
  constructor(attributes) {
    this.attributes = attributes;
  }

  get name() {
    return this.attributes.name.value;
  }

  getAttributes() {
    return Object.values(this.attributes).filter( (attribute) => {
      return attribute.value !== null;
    });
  }

  getEditableAttributes() {
    return this.getAttributes().filter( (attribute) => {
      return attribute.isEditable;
    });
  }
};
