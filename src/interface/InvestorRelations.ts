export interface InvestorRelationsCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  acf: any[];
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    "wp:post_type": { href: string }[];
    curies: { name: string; href: string; templated: boolean }[];
  };
}

export interface InvestorRelation {
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
  featured_media: number;
  parent: number;
  template: string;
  meta: {
    _acf_changed: boolean;
  };
  "investor-relations-category": number[];
  acf: {
    sub_title: string;
    file: string;
  };
  jetpack_sharing_enabled: boolean;
  featured_media_src_url: string | null;
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    "wp:attachment": { href: string }[];
    "wp:term": {
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }[];
    curies: {
      name: string;
      href: string;
      templated: boolean;
    }[];
  };
}
