interface Guid {
  rendered: string;
}

interface Title {
  rendered: string;
}

interface Content {
  rendered: string;
  protected: boolean;
}

interface Excerpt {
  rendered: string;
  protected: boolean;
}

interface Meta {
  _acf_changed: boolean;
  footnotes: string;
}

interface Acf {
  banner_image: boolean;
  banner_video: boolean;
}

interface Link {
  href: string;
  embeddable?: boolean;
}

interface Links {
  self: Link[];
  collection: Link[];
  about: Link[];
  author: Link[];
  replies: Link[];
  "version-history": Link[];
  "predecessor-version": Link[];
  "wp:featuredmedia"?: Link[];
  "wp:attachment": Link[];
  "wp:term": Link[];
  curies: Link[];
}

export interface PrivacyPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: Guid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: Title;
  content: Content;
  excerpt: Excerpt;
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Meta;
  acf: Acf;
  jetpack_sharing_enabled: boolean;
  featured_media_src_url: string | null;
  _links: Links;
}
