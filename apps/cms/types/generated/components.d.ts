import type { Schema, Struct } from '@strapi/strapi';

export interface SharedCallout extends Struct.ComponentSchema {
  collectionName: 'components_shared_callouts';
  info: {
    displayName: 'Callout';
    icon: 'information';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['note', 'tip', 'warning', 'danger']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'note'>;
  };
}

export interface SharedCode extends Struct.ComponentSchema {
  collectionName: 'components_shared_codes';
  info: {
    displayName: 'Code';
    icon: 'code';
  };
  attributes: {
    code: Schema.Attribute.Text & Schema.Attribute.Required;
    filename: Schema.Attribute.String;
    language: Schema.Attribute.Enumeration<
      [
        'typescript',
        'javascript',
        'tsx',
        'jsx',
        'php',
        'python',
        'java',
        'bash',
        'json',
        'yaml',
        'sql',
        'html',
        'css',
        'dockerfile',
        'nginx',
        'diff',
        'markdown',
        'plaintext',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'typescript'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMetric extends Struct.ComponentSchema {
  collectionName: 'components_shared_metrics';
  info: {
    description: 'A headline number, e.g. "30%" + "fewer bugs"';
    displayName: 'Metric';
    icon: 'chartCircle';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String;
    platform: Schema.Attribute.Enumeration<
      [
        'linkedin',
        'github',
        'x',
        'youtube',
        'instagram',
        'facebook',
        'medium',
        'devto',
        'stackoverflow',
        'whatsapp',
        'email',
        'website',
        'other',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSpokenLanguage extends Struct.ComponentSchema {
  collectionName: 'components_shared_spoken_languages';
  info: {
    displayName: 'Spoken language';
    icon: 'earth';
  };
  attributes: {
    cefr: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 3;
      }>;
    level: Schema.Attribute.Enumeration<
      ['native', 'fluent', 'professional', 'intermediate', 'beginner']
    > &
      Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.callout': SharedCallout;
      'shared.code': SharedCode;
      'shared.media': SharedMedia;
      'shared.metric': SharedMetric;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.social-link': SharedSocialLink;
      'shared.spoken-language': SharedSpokenLanguage;
    }
  }
}
