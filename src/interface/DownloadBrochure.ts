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
    cad_data?: string;
    pdf_file: number;
    is_cad?:boolean;
    images?:string[]
  }
  
  interface Link {
    href: string;
  }
  
  interface Links {
    self: Link[];
    collection: Link[];
    about: Link[];
    'wp:featuredmedia': Link[];
    'wp:attachment': Link[];
    'wp:term': Link[];
    curies: { name: string; href: string; templated: boolean }[];
  }
  
  export interface DownloadBrochure {
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
    template: string;
    meta: Meta;
    'downloads-category': number[];
    acf: Acf;
    jetpack_sharing_enabled: boolean;
    featured_media_src_url: string;
    _links: Links;
  }
  

  interface Link {
    href: string;
  }
  
  interface Links {
    self: Link[];
    collection: Link[];
    about: Link[];
    'wp:post_type': Link[];
    curies: { name: string; href: string; templated: boolean }[];
  }
  
  export interface DownloadsCategory {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    parent: number;
    meta: any[]; // Assuming meta can be of any type, replace 'any' with specific type if known
    acf: any[]; // Assuming acf can be of any type, replace 'any' with specific type if known
    _links: Links;
  }