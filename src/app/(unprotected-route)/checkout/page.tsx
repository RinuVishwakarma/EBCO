import CheckoutContainer from "@/components/containers/CheckoutContainer";
import { Suspense } from "react";

const Checkout = () => {
  return (
    <>
      <Suspense fallback={
        <div
          className="new-arrival-loader"
          style={{
            height: "80vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
      }>

        <CheckoutContainer />
      </Suspense>
    </>
  );
};

export default Checkout;
