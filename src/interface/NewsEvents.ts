export interface NewsEvent {
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
    template: string;
    'news-event-category': number[];
    acf: {
        image_gallery: string[] | null; // You can define a type for image_gallery if it has a specific structure
        views: string;
    };
    jetpack_sharing_enabled: boolean;
    featured_media_src_url: string;
    _links: {
        self: {
            href: string;
        }[];
        collection: {
            href: string;
        }[];
        about: {
            href: string;
        }[];
        'wp:featuredmedia': {
            embeddable: boolean;
            href: string;
        }[];
        'wp:attachment': {
            href: string;
        }[];
        'wp:term': {
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


interface ProductImage {
    src: string;
  }
  
  interface ProductTag {
    id: number;
  }
  
  interface Product {
    id: string;
    name: string;
    description: string;
    images: ProductImage[];
    price: number;
    regular_price?: number;
    tags: ProductTag[];
  }
  
  export interface NewsEventData {
    id: number;
    date: string;
    date_gmt: string;
    guid: { rendered: string };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: { rendered: string };
    content: { rendered: string; protected: boolean };
    featured_media: number;
    template: string;
    news_event_category: number[];
    acf: { image_gallery: null | string[]; views: string };
    jetpack_sharing_enabled: boolean;
    featured_media_src_url: string;
    _links: any;
  }
  