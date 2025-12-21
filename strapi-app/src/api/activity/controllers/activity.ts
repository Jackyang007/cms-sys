// src/api/activity/controllers/activity.ts
export default {
  async list(ctx) {
    const data = await strapi.entityService.findMany(
      'api::activity.activity',
      {
        populate: {},        // ✅ 替代 'deep'
        sort: { sort: 'asc' },
      }
    );

    ctx.body = { data };
  },

  async featured(ctx) {
    const data = await strapi.entityService.findMany(
      'api::activity.activity',
      {
        filters: { status: 'online' },
        populate: {},        // ✅ 替代 'deep'
        sort: { sort: 'asc' },
        limit: 5,
      }
    );

    ctx.body = { data };
  },
};
