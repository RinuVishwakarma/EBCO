import { Suspense } from "react";
import MyProfile from "../module-components/MyProfile/MyProfile";

const MyProfileContainer = () => {
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
      <MyProfile />
    </Suspense>
  );
};

export default MyProfileContainer;
