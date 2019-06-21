const ElementDetails = require('./element_details.js');
const Exceptions = require('./exceptions.js');
const Page = require('./page.js');

/*
 * This class provides functionality for interacting with a page on the Fn UI
 */
module.exports = class FnPage extends Page {
  // Gets the value of any error messages that have appeared on the Fn UI
  async getError() {
    let flashMessageAlert = await this.findById('flash-messages');
    return await flashMessageAlert.getText();
  }

  /*
   * Fills in an Fn form using the provided formDetails
   *
   * @param {FormDetails} formDetails - an instance of FormDetails containing
   *        information on where to find the form elements and the values that
   *        should be filled into the form
   */
  async _fillFormDetails(formDetails) {
    let promiseArray = [];
    for (let i = 0; i < formDetails.length; i++) {
      let fillField = this.findById(formDetails[i].elementId)
        .then(async function(field) {
          await field.clear();
          field.sendKeys(formDetails[i].value);
        }
      );

      promiseArray.push(fillField);
    }
    await Promise.all(promiseArray);
  }

  /*
   * Find an element on the page using the provided elementDetails
   *
   * @param {ElementDetails} elementDetails - an instance of ElementDetails
   *        containing information on how to find the HTML element.
   *
   * @return {selenium-webdriver.By} containing the HTML element location
   */
  async findByElementDetails(elementDetails) {
    if (elementDetails.type === ElementDetails.TYPE.ID) {
      return await this.findById(elementDetails.selector);
    }

    if (elementDetails.type === ElementDetails.TYPE.CSS) {
      return await this.findByCss(elementDetails.selector);
    }

    throw new Exceptions.UnimplementedError(
      `Unable to find element: '${elementDetails.selector}'. ` +
      `Unimplemented element type: ${elementDetails.type}`
    );
  }
};
