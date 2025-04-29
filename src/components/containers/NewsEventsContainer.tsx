import { Suspense } from "react";
import NewsEvents from "../module-components/NewsEvents/NewsEvents";

const NewsEventsContainer = () => {
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
      <NewsEvents />
    </Suspense>
  );
};
export default NewsEventsContainer;
