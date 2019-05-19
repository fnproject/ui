const fs = require('fs');
const yaml = require('yaml');

/*
 * This class is used to access values from the integration test config
 */
module.exports = class Config {
  constructor(configLocation='test_integration/etc/config.yaml') {

    // Stores default values to use if they aren't specified in the config
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

  /*
   * Get the config value
   *
   * It will first try to use the value specified in the config file. If this
   * doesn't exist, it will then use the value provided in defaultOverride,
   * if this is null then it will use the default value for the config key
   *
   * @param key {String} - the key for the config value you wish to get
   * @param defaultOverride - the value to use if the config value does not
   *        exist. If set to null, it will use the default value as specified
   *        by the class.
   *
   * @return - the value of config
   */
  get(key, defaultOverride=null) {
    // If the value's specified in the config, use this
    if(this.config !== undefined &&
      this.config.fn_ui !== undefined &&
      this.config.fn_ui[key] !== null
    ) {
      return this.config.fn_ui[key];
    }

    // Otherwise use the defaultOverride value if it's been specified
    if(defaultOverride !== null) {
      return defaultOverride;
    }

    // Otherwise use the default value according to this class
    return this.defaults[key];
  }
};
