import { Box, Typography } from "@mui/material";
import Image from "next/image";
import "@/components/module-components/NewsEvents/NewsEvents.css";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { NewsEventData } from "@/interface/NewsEvents";
import { decodeHtml } from "@/utils/convertHtmltoArray";
import { useRouter } from "next/navigation";

const NewsCard = ({
  item,
  onViewMore,
}: {
  item: NewsEventData;
  onViewMore: (event: NewsEventData) => void;
}) => {

  const router = useRouter();
  return (
    <Box
      key={decodeHtml(item?.title?.rendered)}
      className="videocard-container column-center"
      onClick={() => router.push(`/news-and-events/${item.slug}`)}
    >
      {/* <Typography className="video-date">{getDate(item?.date)}</Typography> */}
      {item?.featured_media_src_url && (
        <Image
          src={item?.featured_media_src_url && item?.featured_media_src_url}
          className="video-image"
          alt={item?.title?.rendered}
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

export default NewsCard;
