export interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  date_created: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  date_modified: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  image_urls:{
    featured_image: string;
    gallery_images: string[]
  }
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: null | string;
  date_on_sale_to: null | string;
  total_sales: number;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number;
  stock_status: string;
  backorders: string;
  low_stock_amount: string;
  sold_individually: boolean;
  weight: string;
  length: string;
  width: string;
  height: string;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  reviews_allowed: boolean;
  purchase_note: string;
  attributes: {
    [key: string]: any;
  };
  default_attributes: any[];
  menu_order: number;
  post_password: string;
  virtual: boolean;
  downloadable: boolean;
  category_ids: number[];
  tag_ids: number[];
  shipping_class_id: number;
  downloads: any[];
  image_id: string;
  gallery_image_ids: string[];
  gallery_image_urls: string[];
  download_limit: number;
  download_expiry: number;
  rating_counts: any[];
  average_rating: string;
  review_count: number;
  meta_data: {
    id: number;
    key: string;
    value: any;
  }[];
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
}
