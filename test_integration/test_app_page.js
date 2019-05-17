const assert = require('assert');
const randomstring = require('randomstring');

const AppDetails = require('./lib/app_details.js');
const AppPage = require('./lib/app_page.js');
const FnDetails = require('./lib/fn_details.js');
const HomePage = require('./lib/homepage.js');

(async function test_app_page() {
  let appName = randomstring.generate({
    length: 30,
    charset: 'alphabetic'
  });
  let appDetails = new AppDetails(appName);

  let fnName = 'myFn';
  let fnImage = 'fndemouser/myFn';

  try {

    describe('Test Fn UI app page', async function() {
      this.timeout(50000);

      let appUrl;
      before(async () => {
        let homepage = new HomePage();
        await homepage.visit('http://localhost:4000/');
        await homepage.createApp(appDetails);
        await homepage.visitApp(appName);

        appUrl = await homepage.getCurrentUrl();
        await homepage.quit();
      });

      after(async () => {
        let homepage = new HomePage();
        await homepage.visit('http://localhost:4000/');
        await homepage.deleteApp(appName);
        await homepage.quit();
      });

      let appPage;
      beforeEach(async () => {
        appPage = new AppPage();
        await appPage.visit(appUrl);
      });

      afterEach(async () => {
        await appPage.quit();
      });

      it('can load interface', async () => {
        assert.ok(await appPage.loadedCorrectly());
      });

      it('can create a function', async () => {
        let fnDetails = new FnDetails(fnName, fnImage);
        await appPage.createFn(fnDetails);
      });

      it('can edit a function', async () => {
        let newFnImage = fnImage + '2';
        let fnDetails = new FnDetails(fnName, newFnImage);
        await appPage.editFn(fnDetails);
        assert.equal(await appPage.getFnImage(fnDetails.name), newFnImage);
      });

      it('should disallow large memory allocation', async () => {
        let fnDetails = new FnDetails(fnName, null, Number.MAX_SAFE_INTEGER);
        await appPage.editFn(fnDetails);

        let errorText = await appPage.getError();
        assert.ok(errorText.includes('out of range'));
      });

      it('can delete a function', async () => {
        await appPage.deleteFn(fnName);
      });
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(new Error(err.message));
  }
})();
