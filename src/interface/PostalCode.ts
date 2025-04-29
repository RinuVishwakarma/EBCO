export interface PostalCodeResponse {
  id: string;
  enabled: string;
  country_id: string;
  state_id: string;
  city_id: string;
  pincode: string;
  pincode_name: string;
  region: string;
  division: string;
  is_deliverable: string;
  freight_charges: string;
  is_cod: string;
  created_by: string;
  created_timestamp: string;
  updated_by: string;
  updated_timestamp: string;
  country_name: string;
  state_name: string;
  city_name: string;
  status?: string | number;
}

export interface DistributorData {
  post_id: string;
  post_title: string;
  email: string;
  phone: string;
  seller_id: string;
}
