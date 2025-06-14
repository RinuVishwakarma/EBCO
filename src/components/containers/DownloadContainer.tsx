import { Suspense } from "react";
import Downloads from "../module-components/Downloads/Downloads";

const DownloadContainer = () => {
  return (
    <Suspense
      fallback={
        <div
          className="loaderr"
          style={{
            height: "90vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
      }
    >
      <Downloads />
    </Suspense>
  );
};

export default DownloadContainer;
