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
  
  interface BannerVideo {
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
  }
  
  export interface CarouselItem {
    logo: string;
    card_title: string;
    card_description: string;
    title: string;
    content: string;
    image: string;
  }
  
  interface ACF {
    banner_image: boolean;
    banner_video: BannerVideo;
    carousel: CarouselItem[];
    gallery: string[];
  }
  
  interface Link {
    href: string;
    embeddable?: boolean;
    count?: number;
    id?: number;
  }
  
  interface Links {
    self: Link[];
    collection: Link[];
    about: Link[];
    author: Link[];
    replies: Link[];
    "version-history": Link[];
    "predecessor-version": Link[];
    "acf:attachment": Link[];
    "wp:attachment": Link[];
    curies: Link[];
  }
  
  export interface WordPressSustainabilityPage {
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
    acf: ACF;
    jetpack_sharing_enabled: boolean;
    featured_media_src_url: string | null;
    _links: Links;
  }

