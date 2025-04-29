// productRange.tsx

export interface DistributorCenter {
  id: number;
  image?: string | null;
  place: string;
  name?: string;
  address: string;
  phone?: number | string;
  email?: string;
  location?: string;
  shortName?: string;
  zone?: string;
  coordinates?: number[];
  contactPerson?: string;
  google_maps_link: string;
}




export interface DiscoveryCenterIndia {
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
  discovery_center_category: number[];
  acf: {
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zone: string;
    pincode: number;
    remarks: string;
    latitude: string;
    longitude: string;
    google_maps_link: string;
  };
  jetpack_sharing_enabled: boolean;
  featured_media_src_url: string | null;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    wp_attachment: Array<{ href: string }>;
    wp_term: Array<{
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }>;
    curies: Array<{
      name: string;
      href: string;
      templated: boolean;
    }>;
  };
}

export interface DiscoveryCenterInternational {
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
  discovery_center_category: number[];
  acf: {
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zone: string;
    pincode: string;
    remarks: string;
    latitude: string;
    longitude: string;
    google_maps_link: string;
  };
  jetpack_sharing_enabled: boolean;
  featured_media_src_url: string | null;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    wp_attachment: Array<{ href: string }>;
    wp_term: Array<{
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }>;
    curies: Array<{
      name: string;
      href: string;
      templated: boolean;
    }>;
  };
}

export interface DiscoveryCenter {
  id: number;
  date: string;
  date_gmt: string;
  guid: GUID;
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
  "discovery-center-category": number[];
  acf: Acf;
  jetpack_sharing_enabled: boolean;
  featured_media_src_url: string;
  _links: Links;
}

export interface GUID {
  rendered: string;
}

export interface Title {
  rendered: string;
}

export interface Content {
  rendered: string;
  protected: boolean;
}

export interface Meta {
  _acf_changed: boolean;
}

export interface Acf {
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zone: string;
  pincode: string;
  remarks: string;
  latitude: string;
  carousel: string[] | boolean;
  longitude: string;
}

export interface Links {
  self: Link[];
  collection: Link[];
  about: Link[];
  "wp:featuredmedia": Link[];
  "wp:attachment": Link[];
  "wp:term": Link[];
  curies: Curie[];
}

export interface Link {
  href: string;
  embeddable?: boolean;
}

export interface Curie {
  name: string;
  href: string;
  templated: boolean;
}
