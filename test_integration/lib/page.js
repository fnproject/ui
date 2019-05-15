const {Builder, By, until} = require('selenium-webdriver');

module.exports = class Page {
  constructor() {
    this.driver = new Builder()
      .forBrowser('chrome')
      .build();
  }

  async visit(url) {
    return await this.driver.get(url);
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
