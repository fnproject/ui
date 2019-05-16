const {until} = require('selenium-webdriver');

const FnPage = require('./fn_page.js');

module.exports = class AppPage extends FnPage {

  _fnTableRowSelector(fnName) {
    return `#fnTable tr[name="${fnName}"]`;
  }

  async loadedCorrectly() {
    let fnTable = await this.getFnTable();
    let fnTableText = await fnTable.getText();
    return fnTableText.includes('No Functions');
  }

  async openCreateFn() {
    let openCreateFnBtn = await this.findById('openCreateFn');
    await openCreateFnBtn.click();
  }

  async getFnTable() {
    return await this.findById('fnTable');
  }

  async getFnTableRow(fnName) {
    return await this.findByCss(this._fnTableRowSelector(fnName));
  }

  async createFn(fnDetails) {
    await this.openCreateFn();
    await this._fillFormDetails(fnDetails.getAttributes());
    await this.submitFn();
    await this.getFnTableRow(fnDetails.name);
  }

  async openEditFn(fnName) {
    await this.openFnOptions(fnName);
    let openEditFnBtn = await this.findByCss(this._fnTableRowSelector(fnName) + ' [name="openEditFn"]');
    await openEditFnBtn.click();
  }

  async editFn(fnDetails) {
    await this.openEditFn(fnDetails.name);
    await this._fillFormDetails(fnDetails.getEditableAttributes());
    await this.submitFn();
  }

  async submitFn() {
    let submitFnBtn = await this.findById('submitFn');
    await submitFnBtn.click();
  }

  //TODO think of a way to generalise this for each app parameter
  async getFnImage(fnName) {
    await this.openEditFn(fnName);

    let fnImageInput = await this.findById('fnImage');
    return await fnImageInput.getAttribute('value');
  }

  async openFnOptions(fnName) {
    let moreOptionsBtn = await this.findByCss(this._fnTableRowSelector(fnName) + ' [name="openMoreOptions"]');
    await moreOptionsBtn.click();
  }

  async deleteFn(fnName) {
    await this.openFnOptions(fnName);

    let deleteBtn = await this.findByCss(this._fnTableRowSelector(fnName) + ' [name="deleteFn"]');
    await deleteBtn.click();

    let deleteConfirmation = await this.driver.wait(until.alertIsPresent(), 10000, 'Waiting for alert');
    await deleteConfirmation.accept();
  }
};
