module.exports = class AppDetails {
  constructor(name, syslogUrl=null) {
    this.attributes = {
      name: new AppAttribute(name, 'appName', false),
      image: new AppAttribute(syslogUrl, 'appSyslogUrl'),
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

class AppAttribute {
  constructor(value, elementId, isEditable=true) {
    this.value = value;
    this.elementId = elementId;
    this.isEditable = isEditable;
  }
}
