interface AvatarUrls {
  "24": string;
  "48": string;
  "96": string;
}

interface Links {
  self: { href: string }[];
  collection: { href: string }[];
}

interface WooCommerceMeta {
  variable_product_tour_shown: string;
  activity_panel_inbox_last_read: string;
  activity_panel_reviews_last_read: string;
  categories_report_columns: string;
  coupons_report_columns: string;
  customers_report_columns: string;
  orders_report_columns: string;
  products_report_columns: string;
  revenue_report_columns: string;
  taxes_report_columns: string;
  variations_report_columns: string;
  dashboard_sections: string;
  dashboard_chart_type: string;
  dashboard_chart_interval: string;
  dashboard_leaderboard_rows: string;
  homepage_layout: string;
  homepage_stats: string;
  task_list_tracked_started_tasks: string;
  help_panel_highlight_shown: string;
  android_app_banner_dismissed: string;
}

export interface UserInfo {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: AvatarUrls;
  meta: any[];
  acf: {
    profile_picture: string | null;
  };
  is_super_admin: boolean;
  woocommerce_meta: WooCommerceMeta;
  first_name: string;
  last_name: string;
  billing_address_1: string;
  billing_address_2: string;
  gst_in: string | number;
  billing_phone: string;
  email: string;
  _links: Links;
  profile_picture?: string;
}
