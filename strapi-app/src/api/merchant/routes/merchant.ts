export default {
  routes: [
    {
      method: 'GET',
      path: '/merchants',
      handler: 'merchant.list',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/merchants/:id',
      handler: 'merchant.detail',
      config: {
        auth: false,
      },
    },
  ],
};
