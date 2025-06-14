// productRange.tsx

export interface Arrivals {
    id: number;
    image: string;
    title:string;
    place: string;
}

const newsAndEvents: Arrivals[] = [
    {
        id: 1,
        image: '/images/news_and_events/news-events-0.webp',
        title:'Jadeed Ajar General Trading LLC - Dubai (International Discovery Center)',
        place: "Dubai, UAE",
    },
    {
        id: 2,
        image: '/images/news_and_events/news-events-1.webp',
        title:'IIID Design Confluence..',
        place: "Vijayawada",
    },
    {
        id: 3,
        image: '/images/news_and_events/news-events-2.webp',
        title:'In-Effects Marketing',
        place: "Vijayawada",
    },
    {
        id: 4,
        image: '/images/news_and_events/news-events-3.webp',
        title:'Classic Sales Corporati...',
        place: "Pune",
    },
];

export default newsAndEvents;
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
    featured_media_src_url:string;
    template: string;
    "news-event-category": number[];
    acf: {
      image_gallery: any; // Assuming image_gallery can be null or any other type
      views: string;
    };
    jetpack_sharing_enabled: boolean;
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
      "wp:featuredmedia": {
        embeddable: boolean;
        href: string;
      }[];
      "wp:attachment": {
        href: string;
      }[];
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
  