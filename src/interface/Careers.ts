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
  
  interface Acf {
    location: string;
    required_experience: string;
    required_education: string;
  }
  
  interface Link {
    href: string;
  }
  
  interface Links {
    self: Link[];
    collection: Link[];
    about: Link[];
    "wp:attachment": Link[];
    "wp:term": Link[];
    curies: {
      name: string;
      href: string;
      templated: boolean;
    }[];
  }
  
  export interface CareerPost {
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
    "careers-category": string[];
    acf: Acf;
    jetpack_sharing_enabled: boolean;
    featured_media_src_url: string | null;
    _links: Links;
  }
  

  interface RenderedObject {
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
  
  interface BannerImage {
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
  }
  
  interface Acf {
    banner_image: BannerImage;
    banner_video: boolean;
  }
  
  interface Link {
    href: string;
  }
  
  interface Links {
    self: Link[];
    collection: Link[];
    about: Link[];
    author: Link[];
    replies: Link[];
    "version-history": {
      count: number;
      href: string;
    }[];
    "predecessor-version": {
      id: number;
      href: string;
    }[];
    "wp:attachment": Link[];
    curies: {
      name: string;
      href: string;
      templated: boolean;
    }[];
  }
  
  export interface CareersPage {
    id: number;
    date: string;
    date_gmt: string;
    guid: RenderedObject;
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
  

  interface Link {
    href: string;
  }
  
  interface Links {
    self: Link[];
    collection: Link[];
    about: Link[];
    "wp:post_type": Link[];
    curies: {
      name: string;
      href: string;
      templated: boolean;
    }[];
  }
  
  export interface CareerCategory {
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
    _links: Links;
  }
  