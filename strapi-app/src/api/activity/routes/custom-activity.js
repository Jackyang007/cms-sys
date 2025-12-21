'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/activities/featured',
      handler: 'custom-activity.featured',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/activities',
      handler: 'custom-activity.list',
      config: { auth: false },
    },
  ],
};
