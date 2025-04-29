import { Box, Typography } from "@mui/material";
import Image from "next/image";
import "./brochure/Brochure.css";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { NewsEvent } from "@/interface/NewsEvents";
import { decodeHtml } from "@/utils/convertHtmltoArray";

const VideoCard = ({
  item,
  onViewMore,
}: {
  item: NewsEvent;
  onViewMore: (videoId: NewsEvent) => void;
}) => {
  const getDate = (date: string) => {
    const dateObject = new Date(date);
    const month = dateObject.toLocaleString("default", { month: "short" }); // Get abbreviated month name (e.g., "May")
    const day = dateObject.getDate(); // Get day of the month (e.g., 26)
    const year = dateObject.getFullYear();

    // Construct the formatted date string
    const formattedDate = `${month} ${day} ${year}`;
    return formattedDate;
  };
  return (
    <Box
      key={item?.id}
      className="videocard-container column-center"
      onClick={() => onViewMore(item)}
    >

      {/* <Typography className="video-date">
        {item.date && getDate(item?.date)}
      </Typography> */}
      {item?.featured_media_src_url && (
        <Image
          src={item?.featured_media_src_url}
          className="video-image"
          alt={item?.featured_media_src_url}
          width={300}
          height={300}
        />
      )}
      <Typography
        className="card-title single-line w-100"
        sx={{
          color: customColors.darkBlueEbco,
        }}
      >
        {decodeHtml(item?.title?.rendered)}
      </Typography>
      <button
        className="row-center video-button"
        onClick={() => onViewMore(item)}
      >
        View more{" "}
        {/* <Image
          src="/images/right-white.svg"
          alt="pdf"
          width={20}
          height={20}
          className="right-arrow-view"
        />{" "} */}
      </button>
    </Box>
  );
};

export default VideoCard;
