/*
 * This class contains information about how to locate an HTML element
 */
module.exports = class ElementDetails {
  /*
   * @param selector {String} - how to locate the element on the page e.g.
   *        the css selector or the element's HTML id
   * @param type {ElementDetails.TYPE} - information about what the selector
   *        string contains. E.g. CSS for a CSS selector
   */
  constructor(selector, type) {
    this.selector = selector;
    this.type = type;
  }

  /*
   * Valid types are:
   * CSS - to denote this.selector is a CSS selector
   * ID - to deonote this.selector is an HTML id
   */
  static get TYPE() {
    return Object.freeze({
      CSS: 1,
      ID: 2,
    });
  }
};
