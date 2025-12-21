'use strict';

function toDateStartISO(dateStr) {
  // YYYY-MM-DD -> 00:00:00.000Z (按 UTC，够用；如果你要按中国时区可再改)
  return new Date(`${dateStr}T00:00:00.000Z`).toISOString();
}

function toDateEndISO(dateStr) {
  // YYYY-MM-DD -> 23:59:59.999Z
  return new Date(`${dateStr}T23:59:59.999Z`).toISOString();
}

module.exports = {
  async featured(ctx) {
    const data = await strapi.entityService.findMany('api::activity.activity', {
      filters: { isFeatured: true },
      sort: { endTime: 'desc' },
      populate: { merchant: true },
      publicationState: 'live',
      limit: 10,
    });

    ctx.body = { data };
  },

  async list(ctx) {
    const { date } = ctx.query;

    const filters = {};
    if (date) {
      // 例：筛选活动仍在进行（endTime >= 当天结束），你也可以改成某一天范围内的活动
      filters.endTime = { $gte: toDateStartISO(date) };
    }

    const data = await strapi.entityService.findMany('api::activity.activity', {
      filters,
      sort: { endTime: 'asc' },
      populate: { merchant: true },
      publicationState: 'live',
      limit: 50,
    });

    ctx.body = { data };
  },
};
