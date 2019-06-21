const {until} = require('selenium-webdriver');

const AppPageSelector = require('./app_page_selector.js');
const FnPage = require('./fn_page.js');

/*
 * This class provides an interface to the App Details page on the Fn UI
 *
 * For example, it can be used to create a new function for an app, edit
 * details for an existing app, etc
 */
module.exports = class AppPage extends FnPage {

  // Get the css selector for the provided function row in the functions table
  _fnTableRowSelector(fnName) {
    return `#fnTable tr[name="${fnName}"]`;
  }

  /*
   * Get the value of the provided HTML element's field
   *
   * @param fnName {String} - the name of the Fn Function that the field
   *        belongs to
   * @param elementDetails {ElementDetails} - an instance of ElementDetails
   *        containing information on how to locate this HTML element
   *
   * @return - the value of the HTML element
   */
  async _getFnAttribute(fnName, elementDetails) {
    await this.openEditFn(fnName);

    let inputField =
      await this.findByElementDetails(elementDetails);
    return await inputField.getAttribute('value');
  }

  // Checks if the App page loaded correctly
  async loadedCorrectly() {
    let fnTable = await this.getFnTable();
    let fnTableText = await fnTable.getText();
    return fnTableText.includes('No Functions');
  }

  // Opens the CreateFn Modal
  async openCreateFn() {
    let openCreateFnBtn =
      await this.findByElementDetails(AppPageSelector.openCreateFnBtn());
    await openCreateFnBtn.click();
  }

  // Gets the table containing information about the App's functions
  async getFnTable() {
    return await this.findByElementDetails(AppPageSelector.fnTable());
  }

  // Gets the row containing information about the provided Function's details
  async getFnTableRow(fnName) {
    return await this.findByElementDetails(AppPageSelector.fnTableRow(fnName));
  }

  /*
   * Creates a new Function using the app details page
   *
   * @param fnDetails {FnDetails} - details of the Function you want to create
   */
  async createFn(fnDetails) {
    await this.openCreateFn();
    await this._fillFormDetails(fnDetails.getAttributes());
    await this.submitFn();
    await this.getFnTableRow(fnDetails.name);
  }

  // Opens the EditFn modal for the specified function
  async openEditFn(fnName) {
    await this.openFnOptions(fnName);
    let openEditFnBtn =
      await this.findByElementDetails(AppPageSelector.openEditFnBtn(fnName));
    await openEditFnBtn.click();
  }

  /*
   * Edits an existing Function using the fnDetails provided
   *
   * @param fnDetails {FnDetails} - the new Function details you want to use
   */
  async editFn(fnDetails) {
    await this.openEditFn(fnDetails.name);
    await this._fillFormDetails(fnDetails.getEditableAttributes());
    await this.submitFn();
  }

  // Submits the new/edit Function form
  async submitFn() {
    let submitFnBtn =
      await this.findByElementDetails(AppPageSelector.submitFnBtn());
    await submitFnBtn.click();
  }

  // Opens the dropdown containing additional options that can be performed
  // on the Function
  async openFnOptions(fnName) {
    let moreOptionsBtn =
      await this.findByElementDetails(AppPageSelector.openMoreOptionsBtn(fnName));
    await moreOptionsBtn.click();
  }

  // Deletes the specified function
  async deleteFn(fnName) {
    await this.openFnOptions(fnName);

    let deleteBtn =
      await this.findByElementDetails(AppPageSelector.deleteFnBtn(fnName));
    await deleteBtn.click();

    let deleteConfirmation = await this.driver.wait(
      until.alertIsPresent(), 10000, 'Waiting for alert');
    await deleteConfirmation.accept();
  }

  // Gets the specified function's image details from the interface
  async getFnImage(fnName) {
    return await this._getFnAttribute(fnName, AppPageSelector.fnImageInput());
  }

  // Gets the specified function's memory limits from the interface
  async getFnMemory(fnName) {
    return await this._getFnAttribute(fnName, AppPageSelector.fnMemoryInput());
  }

  // Gets the specified function's timeout from the interface
  async getFnTimeout(fnName) {
    return await this._getFnAttribute(fnName, AppPageSelector.fnTimeoutInput());
  }

  // Gets the specified function's idle timeout from the interface
  async getFnIdleTimeout(fnName) {
    return await this._getFnAttribute(
      fnName, AppPageSelector.fnIdleTimeoutInput()
    );
  }
};
