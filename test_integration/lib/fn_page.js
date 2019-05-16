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
};
