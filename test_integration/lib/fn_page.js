const ElementDetails = require('./element_details.js');
const Exceptions = require('./exceptions.js');
const Page = require('./page.js');

module.exports = class FnPage extends Page {
  async getError() {
    let flashMessageAlert = await this.findById('flash-messages');
    return await flashMessageAlert.getText();
  }

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
