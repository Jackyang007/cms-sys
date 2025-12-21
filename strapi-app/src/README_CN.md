# Strapi 结构说明（活动/商户）

## 组件（src/components/ui）

- `image-item`：图片项，支持直接填 URL 或上传媒体文件。
  - `url`：图片链接（字符串，可选）
  - `file`：图片媒体（可选）
  - `alt`：图片说明（可选）
- `banner`：Banner，包含多张图片。
  - `images`：`image-item` 列表（可选）
- `avatar-item`：头像项，用于头像滚动列表。
  - `name`：姓名（必填）
  - `avatarUrl`：头像 URL（可选）
  - `avatarFile`：头像媒体（可选）
  - `phoneMask`：手机号掩码（可选）
- `cta`：CTA 文案。
  - `reportText`：活动海报文案（可选，默认“活动海报”）
  - `signupText`：报名文案（可选，默认“立即报名参与”）

## 内容类型（src/api）

### Merchant

字段：
- `name`（必填）
- `address`
- `phone`
- `latitude`
- `longitude`
- `status`：`active` / `inactive`
- `activities`：关联 `Activity`（一对多）

### Activity

字段：
- `meta_title`（必填）
- `meta_version`
- `slug`（从 `meta_title` 生成）
- `startTime`
- `endTime`（必填）
- `status`：`draft` / `online` / `offline`
- `sort`（默认 100）
- `banner`：`ui.banner`
- `highlights`：JSON 数组
- `minDiscountCount`（默认 30）
- `currentOrderCount`（默认 0）
- `avatars`：`ui.avatar-item` 列表
- `detailImages`：`ui.image-item` 列表
- `ctas`：`ui.cta`
- `merchant`：关联 `Merchant`（多对一）

## 和小程序 mock 的字段映射

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
