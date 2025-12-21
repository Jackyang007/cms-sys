import type { Schema, Struct } from '@strapi/strapi';

export interface ActivityAvatarItem extends Struct.ComponentSchema {
  collectionName: 'components_activity_avatar_items';
  info: {
    description: '\u5934\u50CF\u6EDA\u52A8\u6761\u6761\u76EE';
    displayName: 'AvatarItem';
  };
  attributes: {
    avatarUrl: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ActivityCta extends Struct.ComponentSchema {
  collectionName: 'components_activity_ctas';
  info: {
    description: '\u6309\u94AE\u6587\u6848';
    displayName: 'CTA';
  };
  attributes: {
    reportText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u6D3B\u52A8\u6D77\u62A5'>;
    signupText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u7ACB\u5373\u62A5\u540D\u53C2\u4E0E'>;
  };
}

export interface UiAvatarItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_avatar_items';
  info: {
    description: '\u5934\u50CF\u9879\uFF1A\u7528\u4E8E\u5934\u50CF\u6EDA\u52A8\u5217\u8868\u3002';
    displayName: 'avatar-item';
  };
  attributes: {
    avatarFile: Schema.Attribute.Media<'images'>;
    avatarUrl: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    phoneMask: Schema.Attribute.String;
  };
}

export interface UiBanner extends Struct.ComponentSchema {
  collectionName: 'components_ui_banners';
  info: {
    description: 'Banner \u7EC4\u4EF6\uFF1A\u5305\u542B\u591A\u5F20\u56FE\u7247\u3002';
    displayName: 'banner';
  };
  attributes: {
    images: Schema.Attribute.Component<'ui.image-item', true>;
  };
}

export interface UiCta extends Struct.ComponentSchema {
  collectionName: 'components_ui_ctas';
  info: {
    description: 'CTA \u6587\u6848\uFF1A\u6D3B\u52A8\u5F15\u5BFC\u6587\u5B57\u3002';
    displayName: 'cta';
  };
  attributes: {
    reportText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u6D3B\u52A8\u6D77\u62A5'>;
    signupText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u7ACB\u5373\u62A5\u540D\u53C2\u4E0E'>;
  };
}

export interface UiImageItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_image_items';
  info: {
    description: '\u56FE\u7247\u9879\uFF1A\u652F\u6301\u76F4\u63A5\u586B URL \u6216\u4E0A\u4F20\u5A92\u4F53\u6587\u4EF6\u3002';
    displayName: 'image-item';
  };
  attributes: {
    alt: Schema.Attribute.String;
    file: Schema.Attribute.Media<'images'>;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'activity.avatar-item': ActivityAvatarItem;
      'activity.cta': ActivityCta;
      'ui.avatar-item': UiAvatarItem;
      'ui.banner': UiBanner;
      'ui.cta': UiCta;
      'ui.image-item': UiImageItem;
    }
  }
}
