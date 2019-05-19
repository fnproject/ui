const {Builder, By, until} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

const Config = require('./config.js');

/*
 * This class provides functionality for interacting with a page using Selenium
 */
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

  // Visit the specified URL using Selenium
  async visit(url) {
    return await this.driver.get(url);
  }

  // Get the current URL the Selenium driver is on
  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  // Quit the Selenium browser
  async quit() {
    return await this.driver.quit();
  }

  /*
   * Find and return an element on the page once it's visible using its locator
   *
   * @param locator {selenium-webdriver.By} - information on how to find the
   *        element e.g. a By.id(id)
   *
   * @return {selenium-webdriver.WebElementPromise}
   */
  async findByLocator(locator) {
    await this.driver.wait(until.elementLocated(locator), 10000, 'Looking for element: ' + locator);
    const element = await this.driver.findElement(locator);
    await this.driver.wait(until.elementIsVisible(element), 10000, 'Waiting for element to become visible: ' + locator);
    return element;
  }

  // Find an element on the page by its HTML ID
  async findById(id) {
    return await this.findByLocator(By.id(id));
  }

  // Find an element on the page by its CSS selector
  async findByCss(selector) {
    return await this.findByLocator(By.css(selector));
  }

  // Write the specified text into the specified element
  async write(element, text) {
    return await element.sendKeys(text);
  }
};
