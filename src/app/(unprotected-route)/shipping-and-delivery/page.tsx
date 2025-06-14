import ShippingDeliveryContainer from "@/components/containers/ShippingDelivery";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    ""
};


export default function ShippingAndDelivery() {
  return <ShippingDeliveryContainer />;
}
