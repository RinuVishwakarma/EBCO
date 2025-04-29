import { Suspense } from "react";
import Failed from "../module-components/OrderFailed/Failed";

const FailedContainer = () => {
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
      <Failed />
    </Suspense>
  );
};
export default FailedContainer;
