export interface ShopPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: {
    _acf_changed: boolean;
    footnotes: string;
  };
  acf: {
    banner_image: {
      ID: number;
      id: number;
      title: string;
      filename: string;
      filesize: number;
      url: string;
      link: string;
      alt: string;
      author: string;
      description: string;
      caption: string;
      name: string;
      status: string;
      uploaded_to: number;
      date: string;
      modified: string;
      menu_order: number;
      mime_type: string;
      type: string;
      subtype: string;
      icon: string;
      width: number;
      height: number;
      sizes: {
        thumbnail: string;
        "thumbnail-width": number;
        "thumbnail-height": number;
        medium: string;
        "medium-width": number;
        "medium-height": number;
        medium_large: string;
        "medium_large-width": number;
        "medium_large-height": number;
        large: string;
        "large-width": number;
        "large-height": number;
        "1536x1536": string;
        "1536x1536-width": number;
        "1536x1536-height": number;
        "2048x2048": string;
        "2048x2048-width": number;
        "2048x2048-height": number;
        woocommerce_thumbnail: string;
        "woocommerce_thumbnail-width": number;
        "woocommerce_thumbnail-height": number;
        woocommerce_single: string;
        "woocommerce_single-width": number;
        "woocommerce_single-height": number;
        woocommerce_gallery_thumbnail: string;
        "woocommerce_gallery_thumbnail-width": number;
        "woocommerce_gallery_thumbnail-height": number;
      };
    };
    banner_video: boolean;
  };
  jetpack_sharing_enabled: boolean;
  featured_media_src_url: string | null;
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    author: { embeddable: boolean; href: string }[];
    replies: { embeddable: boolean; href: string }[];
    "version-history": { count: number; href: string }[];
    "predecessor-version": { id: number; href: string }[];
    "wp:attachment": { href: string }[];
    curies: { name: string; href: string; templated: boolean }[];
  };
}
