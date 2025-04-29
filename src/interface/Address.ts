export interface Address {
  fullName: string;
  mobile: number | null;
  email: string;
  flatNumber: string;
  streetName?: string;
  address2?: string;
  pincode?: number | null;
  city?: string;
  state?: string;
  country?: string;
  GSTIN?: string;
}

export interface Enquiry {
  IAm: string;
  fullname: string;
}
