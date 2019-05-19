const assert = require('assert');
const randomstring = require('randomstring');

const AppDetails = require('./lib/app_details.js');
const Config = require('./lib/config.js');
const HomePage = require('./lib/homepage.js');

/*
 * This test uses the Mocha testing framewith with Selenium to test
 * the functionality of the Fn UI's homepage
 */
(async function test_homepage() {
  try {
    describe('Test Fn UI homepage', async function() {
      this.timeout(50000);

      // Use a random App name so it's less likely to conflict
      // with an app that already exists on the Fn server
      let appName = randomstring.generate({
        length: 30,
        charset: 'alphabetic'
      });

      let page;
      beforeEach(async () => {
        page = new HomePage();
        let config = new Config();
        let fn_url = config.get('fn_url');
        await page.visit(fn_url);
      });

      afterEach (async () => {
        await page.quit();
      });

      it('can load interface', async () => {
        assert.ok(await page.loadedCorrectly());
      });

      it('can create an app', async () => {
        let appDetails = new AppDetails(appName);
        await page.createApp(appDetails);
      });

      it('can edit an app', async () => {
        // Use the .invalid TLD so it doesn't link to an actual syslog server
        let syslogUrl = 'tcp://syslogserver.invalid';
        let appDetails = new AppDetails(appName, syslogUrl);
        await page.editApp(appDetails);
        assert.equal(await page.getAppSyslogUrl(appDetails.name), syslogUrl);
      });

      it('should disallow invalid syslog urls', async () => {
        let appDetails = new AppDetails(appName, 'invalid-syslog-url');
        await page.editApp(appDetails);

        let errorText = await page.getError();
        assert.ok(errorText.includes('invalid syslog url'));
      });

      it('can delete an app', async () => {
        await page.deleteApp(appName);
      });
    });
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(new Error(ex.message));
  }
})();
