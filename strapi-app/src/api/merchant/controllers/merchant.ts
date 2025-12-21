export default {
  async list(ctx) {
    const data = await strapi.entityService.findMany(
      'api::merchant.merchant',
      {
        populate: {
          activities: true,
        },
        sort: { name: 'asc' },
      }
    );

    ctx.body = { data };
  },

  async detail(ctx) {
    const { id } = ctx.params;

    const data = await strapi.entityService.findOne(
      'api::merchant.merchant',
      id,
      {
        populate: {
          activities: true,
        },
      }
    );

    ctx.body = { data };
  },
};
