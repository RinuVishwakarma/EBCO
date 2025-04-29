import { E164Number } from "libphonenumber-js";
export interface VisitDiscoveryCenter {
  fullname: string;
  email: string;
  mobile: E164Number;
  discoveryCenter: string;
  discoveryCenterEmail?: string;
  _wpcf7_unit_tag?: string;
}
