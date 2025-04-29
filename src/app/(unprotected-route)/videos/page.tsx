import VideoContainer from "@/components/containers/VideoContainer";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ebco - Videos",
  description:
    "Ebco's videos to explore our range of innovative hardware solutions. Our videos highlight product features and applications providing insights into their benefits for your home and office. Visit our Video page for more details.",
};
const Video = () => {
  return <VideoContainer />;
};

export default Video;
