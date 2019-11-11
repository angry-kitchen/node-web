/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1573192219661_4318';

  config.security = {
    csrf: {
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  config.validate = {
    // convert: false,
    // validateRoot: false,
  };

  config.errorHandler = {
    match: '/api',
  };

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  // add your user config here
  const userConfig = {
    myAppName: 'egg-example',
  };

  return {
    ...config,
    ...userConfig,
  };
};
