const {until} = require('selenium-webdriver');

const FnPage = require('./fn_page.js');
const HomePageSelector = require('./homepage_selector.js');

/*
 * This class provides an interface to the Homepage page on the Fn UI
 *
 * For example, it can be used to create a new app, edit an existing app, etc
 */
module.exports = class HomePage extends FnPage {

  // Get the css selector for the provided app's row in the apps table
  _appTableRowSelector(appName) {
    return `#appsTable tr[name="${appName}"]`;
  }

  /*
   * Get the value of the provided HTML element's field
   *
   * @param appName {String} - the name of the Fn App that the field
   *        belongs to
   * @param elementDetails {ElementDetails} - an instance of ElementDetails
   *        containing information on how to locate this HTML element
   *
   * @return - the value of the HTML element
   */
  async _getAppAttribute(appName, elementDetails) {
    await this.openEditApp(appName);

    let inputField = await this.findByElementDetails(elementDetails);
    return await inputField.getAttribute('value');
  }

  // Checks if the homepage loaded correctly
  async loadedCorrectly() {
    await this.getAppTable();
    return true;
  }

  // Opens the CreateApp Modal
  async openCreateApp() {
    let openCreateAppBtn = await this.findByElementDetails(HomePageSelector.openCreateAppBtn());
    await openCreateAppBtn.click();
  }

  // Gets the table containing information about Apps on the Fn server
  async getAppTable() {
    return await this.findByElementDetails(HomePageSelector.appTable());
  }

  // Gets the row containing details about the provided app from the apps table
  async getAppTableRow(appName) {
    return await this.findByElementDetails(HomePageSelector.appTableRow(appName));
  }

  /*
   * Creates a new Fn App using the homepage
   *
   * @param appDetails {AppDetails} - details of the App you want to create
   */
  async createApp(appDetails) {
    await this.openCreateApp();
    await this._fillFormDetails(appDetails.getAttributes());
    await this.submitApp();
    await this.getAppTableRow(appDetails.name);
  }

  // Opens the EditApp Modal for the specified app
  async openEditApp(appName) {
    let openEditAppBtn = await this.findByElementDetails(HomePageSelector.openEditAppBtn(appName));
    await openEditAppBtn.click();
  }


  /*
   * Edits an existing App using the appDetails provided
   *
   * @param appDetails {appDetails} - the new App details you want to use
   */
  async editApp(appDetails) {
    await this.openEditApp(appDetails.name);
    await this._fillFormDetails(appDetails.getEditableAttributes());
    await this.submitApp();
  }

  // Submits the new/edit App form
  async submitApp() {
    let submitAppBtn = await this.findByElementDetails(HomePageSelector.submitAppBtn());
    await submitAppBtn.click();
  }

  // Opens the more options dropdown for the specified app
  async openAppOptions(appName) {
    let moreOptionsBtn = await this.findByElementDetails(HomePageSelector.openMoreOptionsBtn(appName));
    await moreOptionsBtn.click();
  }

  // Deletes the specified app
  async deleteApp(appName) {
    await this.openAppOptions(appName);

    let deleteBtn = await this.findByElementDetails(HomePageSelector.deleteAppBtn(appName));
    await deleteBtn.click();

    let deleteConfirmation = await this.driver.wait(until.alertIsPresent(), 10000, 'Waiting for alert');
    await deleteConfirmation.accept();
  }

  // Loads the app details page for the specified app
  async visitApp(appName) {
    let appLink = await this.findByElementDetails(HomePageSelector.appLink(appName));
    await appLink.click();
  }

  // Gets the specified apps Syslog URL from the interface
  async getAppSyslogUrl(appName) {
    return await this._getAppAttribute(
      appName, HomePageSelector.appSyslogUrlInput()
    );
  }
};
