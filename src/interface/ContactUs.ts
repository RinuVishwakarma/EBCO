import { link } from "fs";
import { E164Number } from "libphonenumber-js";

export interface ContactUsType {
  fullname: string;
  email: string;
  subject?: string;
  message: string;
  query: string;
  profession?: string;
  contact: string;
  companyName: string;
  address: string;
  mobile: number;
  _wpcf7_unit_tag?: string;
}

export interface ProfileType {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  contactNumber: number;
  contactNumber2: number;
  address2: string;
  gstIn: string;
  profileImg: string;
}

export interface ResetPasswordProp {
  currentpassword: string;
  newpassword: string;
  confirmpassword: string;
}

export interface CareerDetailsForm {
  resume: any;
  fullname: string;
  email: string;
  mobile: E164Number;
  address: string;
  reason: string;
  _wpcf7_unit_tag?: string;
}
