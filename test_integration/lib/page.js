const {Builder, By, until} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

const Config = require('./config.js');

module.exports = class Page {
  constructor() {
    let config = new Config();

    let chromeOptions = new chrome.Options();

    if(config.get('headless')) {
      chromeOptions.addArguments('headless');
    }

    this.driver = new Builder()
      .setChromeOptions(chromeOptions)
      .forBrowser('chrome')
      .build();
  }

  async visit(url) {
    return await this.driver.get(url);
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async quit() {
    return await this.driver.quit();
  }

  async findByLocator(locator) {
    await this.driver.wait(until.elementLocated(locator), 10000, 'Looking for element: ' + locator);
    const element = await this.driver.findElement(locator);
    await this.driver.wait(until.elementIsVisible(element), 10000, 'Waiting for element to become visible: ' + locator);
    return element;
  }

  async findById(id) {
    return await this.findByLocator(By.id(id));
  }

  async findByCss(selector) {
    return await this.findByLocator(By.css(selector));
  }

  async write(element, text) {
    return await element.sendKeys(text);
  }
};
