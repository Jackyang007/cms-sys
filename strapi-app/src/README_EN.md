# Strapi Structure Guide (Activity/Merchant)

## Components (src/components/ui)

- `image-item`: image entry that supports direct URL or uploaded media.
  - `url`: image link (string, optional)
  - `file`: image media (optional)
  - `alt`: image caption (optional)
- `banner`: banner with multiple images.
  - `images`: list of `image-item` (optional)
- `avatar-item`: avatar entry for the rolling avatar list.
  - `name`: name (required)
  - `avatarUrl`: avatar URL (optional)
  - `avatarFile`: avatar media (optional)
  - `phoneMask`: masked phone (optional)
- `cta`: CTA texts.
  - `reportText`: poster text (optional, default "活动海报")
  - `signupText`: signup text (optional, default "立即报名参与")

## Content Types (src/api)

### Merchant

Fields:
- `name` (required)
- `address`
- `phone`
- `latitude`
- `longitude`
- `status`: `active` / `inactive`
- `activities`: relation to `Activity` (one-to-many)

### Activity

Fields:
- `meta_title` (required)
- `meta_version`
- `slug` (generated from `meta_title`)
- `startTime`
- `endTime` (required)
- `status`: `draft` / `online` / `offline`
- `sort` (default 100)
- `banner`: `ui.banner`
- `highlights`: JSON array
- `minDiscountCount` (default 30)
- `currentOrderCount` (default 0)
- `avatars`: list of `ui.avatar-item`
- `detailImages`: list of `ui.image-item`
- `ctas`: `ui.cta`
- `merchant`: relation to `Merchant` (many-to-one)

## Mapping from mini-program mock

- `meta.title` -> `activity.meta_title`
- `meta.version` -> `activity.meta_version`
- `endTime` -> `activity.endTime`
- `banner.images[]` -> `activity.banner.images[]`
- `highlights[]` -> `activity.highlights`
- `minDiscountCount` -> `activity.minDiscountCount`
- `currentOrderCount` -> `activity.currentOrderCount`
- `avatars[]` -> `activity.avatars[]`
- `detailImages[]` -> `activity.detailImages[]`
- `ctas` -> `activity.ctas`
- `merchant` -> `activity.merchant`
