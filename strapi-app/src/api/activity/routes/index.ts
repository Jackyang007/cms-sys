// src/api/activity/routes/index.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/activities/custom-list',
      handler: 'activity.list',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/activities/featured',
      handler: 'activity.featured',
      config: {
        auth: false,
      },
    },
  ],
};
