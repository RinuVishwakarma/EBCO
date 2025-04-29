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

interface Meta {
  _acf_changed: boolean;
}

interface Link {
  href: string;
}

interface Links {
  self: Link[];
  collection: Link[];
  about: Link[];
  "wp:attachment": Link[];
  curies: { name: string; href: string; templated: boolean }[];
}

export interface Faq {
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
  featured_media: number;
  parent: number;
  template: string;
  meta: Meta;
  acf: any[];
  jetpack_sharing_enabled: boolean;
  _links: Links;
}
