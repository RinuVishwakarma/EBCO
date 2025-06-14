interface CategoryLink {
    href: string;
  }
  
  interface CategoryLinks {
    self: CategoryLink[];
    collection: CategoryLink[];
    about: CategoryLink[];
    'wp:post_type': CategoryLink[];
    curies: {
      name: string;
      href: string;
      templated: boolean;
    }[];
  }

  export interface BlogsCategories{
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
    _links: CategoryLinks;
  }
  
  export interface NewsEventCategory {
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
    _links: CategoryLinks;
  }