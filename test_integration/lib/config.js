const fs = require('fs');
const yaml = require('yaml');

module.exports = class Config {
  constructor(configLocation='test_integration/etc/config.yaml') {
    this.defaults = {
      fn_url: 'http://localhost:4000/',
      headless: true,
    };

    let configFile;
    try {
      configFile = fs.readFileSync(configLocation, 'utf8');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`Unable to read config file: ${configLocation}. ${err}`);
      return;
    }

    this.config = yaml.parse(configFile);
  }

  get(key, defaultOverride=null) {
    if(this.config !== undefined &&
      this.config.fn_ui !== undefined &&
      this.config.fn_ui[key] !== null
    ) {
      return this.config.fn_ui[key];
    }

    if(defaultOverride !== null) {
      return defaultOverride;
    }

    return this.defaults[key];
  }
};
