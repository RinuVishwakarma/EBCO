import SearchProductPageContainer from "@/components/containers/SearchProductContainer";
import React, { Suspense } from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Product Search ",
  description:
    ""
};

const worksmart = () => {
  return (
    <div>
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
        <SearchProductPageContainer type="Worksmart" />
      </Suspense>
    </div>
  );
};

export default worksmart;
