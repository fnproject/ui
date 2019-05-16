module.exports = class FnDetails {
  constructor(name, image, memory=null, timeout=null, idle_timeout=null) {
    this.attributes = {
      name: new FunctionAttribute(name, 'fnName', false),
      image: new FunctionAttribute(image, 'fnImage'),
      memory: new FunctionAttribute(memory, 'fnMemory'),
      timeout: new FunctionAttribute(timeout, 'fnTimeout'),
      idle_timeout: new FunctionAttribute(idle_timeout, 'fnIdleTimeout'),
    };
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

class FunctionAttribute {
  constructor(value, elementId, isEditable=true) {
    this.value = value;
    this.elementId = elementId;
    this.isEditable = isEditable;
  }
}
