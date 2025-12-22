// src/api/activity/controllers/activity.ts
const activityPopulate = {
  banner: { populate: { images: true } },
  avatars: true,
  detailImages: true,
  ctas: true,
  merchant: true,
};

const getRequestData = (ctx) => {
  if (ctx.request?.body?.data) return ctx.request.body.data;
  return ctx.request?.body || {};
};

export default {
  async list(ctx) {
    const data = await strapi.entityService.findMany(
      'api::activity.activity',
      {
        populate: activityPopulate,
        sort: { sort: 'asc' },
      }
    );

    ctx.body = { data };
  },

  async featured(ctx) {
    const data = await strapi.entityService.findMany(
      'api::activity.activity',
      {
        filters: { activityStatus: 'online' },
        populate: activityPopulate,
        sort: { sort: 'asc' },
        limit: 5,
      }
    );

    ctx.body = { data };
  },

  async detail(ctx) {
    const { id } = ctx.params;
    const data = await strapi.entityService.findOne(
      'api::activity.activity',
      id,
      {
        populate: activityPopulate,
      }
    );

    if (!data) {
      ctx.status = 404;
      ctx.body = { error: 'Not found' };
      return;
    }

    ctx.body = { data };
  },

  async update(ctx) {
    const { id } = ctx.params;
    const data = await strapi.entityService.update(
      'api::activity.activity',
      id,
      {
        data: getRequestData(ctx),
        populate: activityPopulate,
      }
    );

    ctx.body = { data };
  },
};
