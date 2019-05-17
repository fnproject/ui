module.exports = class ElementDetails {
  constructor(selector, type) {
    this.selector = selector;
    this.type = type;
  }

  static get TYPE() {
    return Object.freeze({
      CSS: 1,
      ID: 2,
    });
  }
};
