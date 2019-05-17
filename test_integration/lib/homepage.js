const {until} = require('selenium-webdriver');

const FnPage = require('./fn_page.js');
const HomePageSelector = require('./homepage_selector.js');

module.exports = class HomePage extends FnPage {

  _appTableRowSelector(appName) {
    return `#appsTable tr[name="${appName}"]`;
  }

  async _getAppAttribute(appName, elementDetails) {
    await this.openEditApp(appName);

    let inputField = await this.findByElementDetails(elementDetails);
    return await inputField.getAttribute('value');
  }

  async loadedCorrectly() {
    await this.getAppTable();
    return true;
  }

  async openCreateApp() {
    let openCreateAppBtn = await this.findByElementDetails(HomePageSelector.openCreateAppBtn());
    await openCreateAppBtn.click();
  }

  async getAppTable() {
    return await this.findByElementDetails(HomePageSelector.appTable());
  }

  async getAppTableRow(appName) {
    return await this.findByElementDetails(HomePageSelector.appTableRow(appName));
  }

  async createApp(appDetails) {
    await this.openCreateApp();
    await this._fillFormDetails(appDetails.getAttributes());
    await this.submitApp();
    await this.getAppTableRow(appDetails.name);
  }

  async openEditApp(appName) {
    let openEditAppBtn = await this.findByElementDetails(HomePageSelector.openEditAppBtn(appName));
    await openEditAppBtn.click();
  }

  async editApp(appDetails) {
    await this.openEditApp(appDetails.name);
    await this._fillFormDetails(appDetails.getEditableAttributes());
    await this.submitApp();
  }

  async submitApp() {
    let submitAppBtn = await this.findByElementDetails(HomePageSelector.submitAppBtn());
    await submitAppBtn.click();
  }

  async openAppOptions(appName) {
    let moreOptionsBtn = await this.findByElementDetails(HomePageSelector.openMoreOptionsBtn(appName));
    await moreOptionsBtn.click();
  }

  async deleteApp(appName) {
    await this.openAppOptions(appName);

    let deleteBtn = await this.findByElementDetails(HomePageSelector.deleteAppBtn(appName));
    await deleteBtn.click();

    let deleteConfirmation = await this.driver.wait(until.alertIsPresent(), 10000, 'Waiting for alert');
    await deleteConfirmation.accept();
  }

  async visitApp(appName) {
    let appLink = await this.findByElementDetails(HomePageSelector.appLink(appName));
    await appLink.click();
  }

  async getAppSyslogUrl(appName) {
    return await this._getAppAttribute(
      appName, HomePageSelector.appSyslogUrlInput()
    );
  }
};
