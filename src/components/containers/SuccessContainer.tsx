import { Suspense } from "react";
import Success from "../module-components/OrderSuccess/Success";

const SuccessContainer = () => {
  return (
    <Suspense
      fallback={
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
      }
    >
      <Success />
    </Suspense>
  );
};
export default SuccessContainer;
