import { Suspense } from "react";
import Videos from "../module-components/Videos/Videos";

export default function VideoContainer() {
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
      <Videos />
    </Suspense>
  );
}
