type Billing = {
  first_name: string;
  last_name?: string;
  email: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
};

type Shipping = {
  first_name: string;
  last_name?: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

type LineItem = {
  product_id: number;
  variation_id?: number;
  quantity?: number | undefined;
};

export type PlaceOrder = {
  payment_method: string;
  payment_method_title: string;
  billing: Billing | any;
  shipping: Shipping | any;
  line_items: LineItem[];
  status?: string;
  customer_id: number;
  shipping_lines?: [
    {
      method_id: string;
      method_title: string;
      total: string;
    }
  ];
  meta_data:[{
    key: string;
    value: string | undefined;
  }]
};

interface BillingResponse {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

interface ShippingResponse {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

interface MetaData {
  id: number;
  key: string;
  value: string;
  display_key: string;
  display_value: string;
}

interface Image {
  id: number;
  src: string;
}

interface LineItemResponse {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: any[];
  meta_data: MetaData[];
  sku: string;
  price: number;
  image: Image;
  parent_name: string;
}

interface Links {
  self: { href: string }[];
  collection: { href: string }[];
}

export interface OrderResponse {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  billing: Billing;
  shipping: Shipping;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: string | null;
  date_paid: string;
  cart_hash: string;
  number: string;
  meta_data: MetaData[];
  line_items: LineItem[];
  tax_lines: any[];
  shipping_lines: any[];
  fee_lines: any[];
  coupon_lines: any[];
  refunds: any[];
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_gmt: string;
  date_modified_gmt: string;
  date_completed_gmt: string | null;
  date_paid_gmt: string;
  currency_symbol: string;
  _links: Links;
}
