import DistributionCenter from "@/components/module-components/DistributionCenter/DistributionCenter";
import { Suspense } from "react";

const DistributionCenterContainer = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DistributionCenter />
    </Suspense>
  );
};

export default DistributionCenterContainer;
