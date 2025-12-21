const fs = require("fs");
const path = require("path");
const { createStrapi } = require("@strapi/strapi");
const mock = require("./mock-activity");

const appDir = path.join(__dirname, "..");
const distDir = path.join(appDir, "dist");
const resolvedDistDir = fs.existsSync(distDir) ? distDir : undefined;

const toIsoLike = (value) => {
  if (!value) return value;
  if (typeof value !== "string") return value;
  return value.replace(" ", "T");
};

const toImageItems = (images) =>
  (images || [])
    .filter(Boolean)
    .map((item) => (typeof item === "string" ? { url: item } : item));

const slugify = (value) => {
  if (!value) return "";
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_.~]/g, "");
};

const toAvatars = (avatars) =>
  (avatars || []).map((item) => {
    const name = item.name || "匿名";
    const phoneMask = /[0-9]/.test(name) ? name : undefined;
    return {
      name,
      avatarUrl: item.avatar,
      phoneMask
    };
  });

const listFromFindMany = (result) => {
  if (Array.isArray(result)) return result;
  if (result && Array.isArray(result.results)) return result.results;
  return [];
};

const mapActivity = (data, merchantId) => ({
  meta_title: data.meta?.title,
  meta_version: data.meta?.version,
  slug: slugify(data.meta?.title) || `activity-${Date.now()}`,
  endTime: toIsoLike(data.endTime),
  banner: data.banner
    ? {
        images: toImageItems(data.banner.images)
      }
    : null,
  highlights: data.highlights || [],
  minDiscountCount: data.minDiscountCount,
  currentOrderCount: data.currentOrderCount,
  avatars: toAvatars(data.avatars),
  detailImages: toImageItems(data.detailImages),
  ctas: data.ctas || null,
  merchant: merchantId
});

const ensureMerchant = async (strapi, merchant) => {
  const existing = await strapi.entityService.findMany(
    "api::merchant.merchant",
    {
      filters: { name: merchant.name },
      limit: 1
    }
  );
  const list = listFromFindMany(existing);
  if (list.length > 0) {
    return list[0];
  }
  return strapi.entityService.create("api::merchant.merchant", {
    data: merchant
  });
};

const upsertActivity = async (strapi, data) => {
  const existing = await strapi.entityService.findMany(
    "api::activity.activity",
    {
      filters: { meta_title: data.meta_title },
      limit: 1
    }
  );
  const list = listFromFindMany(existing);
  if (list.length > 0) {
    return strapi.entityService.update("api::activity.activity", list[0].id, {
      data
    });
  }
  return strapi.entityService.create("api::activity.activity", { data });
};

const main = async () => {
  const strapi = await createStrapi({ appDir, distDir: resolvedDistDir }).load();
  try {
    const merchant = await ensureMerchant(strapi, mock.merchant);
    const activity = mapActivity(mock, merchant.id);
    await upsertActivity(strapi, activity);
    console.log("Seed completed: merchant + activity upserted.");
  } finally {
    try {
      await strapi.destroy();
    } catch (err) {
      console.warn("Warning: Strapi shutdown error (ignored).", err?.message || err);
    }
  }
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
