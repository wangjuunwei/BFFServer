import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

import * as typegoose from '@midwayjs/typegoose';

const path = require('path');

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1622794872035_612';

  // add your config here
  config.middleware = ['reportMiddleware'];

  config.security = {
    csrf: {
      enable: false, // 关闭csrf
      queryName: '_csrf', // 通过 query 传递 CSRF token 的默认字段为 _csrf
    },
    domainWhiteList: ['*'],
  };

  config.cors = {
    origin(ctx) {
      const origin = ctx.get('origin');
      // 业务域名 & 本地调试域名
      if (/localhost|127|192/.test(origin)) {
        return origin;
      }
    },
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true, // 跨域cookie
  };

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };

  config.multipart = {
    mode: 'stream',
    whitelist: () => true,
  };

  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public');

  config.jwt = { secret: '15658106106' };

  return config;
};

export const mongoose: typegoose.DefaultConfig = {
  uri: 'mongodb://127.0.0.1:27017',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'testhub',
    // dbName: '***********',
    // user: '***********',
    // pass: '***********',
  },
};
