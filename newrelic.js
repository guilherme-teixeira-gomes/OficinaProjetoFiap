'use strict';

/**
 * New Relic agent configuration.
 * A license key e o app name são lidos de variáveis de ambiente
 * para não expor segredos no código versionado.
 */
exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'oficina-api'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  distributed_tracing: {
    enabled: true
  },
  logging: {
    level: 'info'
  },
  application_logging: {
    enabled: true,
    forwarding: {
      enabled: true
    },
    metrics: {
      enabled: true
    }
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  }
};
