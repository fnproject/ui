const {until} = require('selenium-webdriver');

const FnPage = require('./fn_page.js');

module.exports = class HomePage extends FnPage {

  _appTableRowSelector(appName) {
    return `#appsTable tr[name="${appName}"]`;
  }

  async loadedCorrectly() {
    await this.getAppTable();
    return true;
  }

  async openCreateApp() {
    let openCreateAppBtn = await this.findById('openCreateApp');
    await openCreateAppBtn.click();
  }

  async getAppTable() {
    return await this.findById('appsTable');
  }

  async getAppTableRow(appName) {
    return await this.findByCss(this._appTableRowSelector(appName));
  }

  async createApp(appDetails) {
    await this.openCreateApp();
    await this._fillFormDetails(appDetails.getAttributes());
    await this.submitApp();
    await this.getAppTableRow(appDetails.name);
  }

  async openEditApp(appName) {
    let openEditAppBtn = await this.findByCss(this._appTableRowSelector(appName) + ' button[name="openEditApp"]');
    await openEditAppBtn.click();
  }

  async editApp(appDetails) {
    await this.openEditApp(appDetails.name);
    await this._fillFormDetails(appDetails.getEditableAttributes());
    await this.submitApp();
  }

  async submitApp() {
    let submitAppBtn = await this.findById('submitApp');
    await submitAppBtn.click();
  }

  //TODO think of a way to generalise this for each app parameter
  async getAppSyslogUrl(appName) {
    await this.openEditApp(appName);

    let syslogUrlInput = await this.findById('appSyslogUrl');
    return await syslogUrlInput.getAttribute('value');
  }

  async openAppOptions(appName) {
    let moreOptionsBtn = await this.findByCss(this._appTableRowSelector(appName) + ' button[name="openMoreOptions"]');
    await moreOptionsBtn.click();
  }

  async deleteApp(appName) {
    await this.openAppOptions(appName);

    let deleteBtn = await this.findByCss(this._appTableRowSelector(appName) + ' [name="deleteApp"]');
    await deleteBtn.click();

    let deleteConfirmation = await this.driver.wait(until.alertIsPresent(), 10000, 'Waiting for alert');
    await deleteConfirmation.accept();
  }

  async visitApp(appName) {
    let appLink = await this.findByCss(this._appTableRowSelector(appName) + ' [name="appLink"]');
    await appLink.click();
  }
};
