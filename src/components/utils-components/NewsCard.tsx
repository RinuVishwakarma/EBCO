import { Box, Typography } from "@mui/material";
import Image from "next/image";
import "./NewsCardNew.css";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { NewsEventData } from "@/interface/NewsEvents";
import { decodeHtml } from "@/utils/convertHtmltoArray";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NewsCardNew = ({
  item,
  onViewMore,
}: {
  item: NewsEventData;
  onViewMore: (event: NewsEventData) => void;
}) => {
  const getDate = (date: string) => {
    const dateObject = new Date(date);
    const month = dateObject?.toLocaleString("default", { month: "short" }); // Get abbreviated month name (e.g., "May")
    const day = dateObject?.getDate(); // Get day of the month (e.g., 26)

    // Construct the formatted date string
    const formattedDate = `${month} ${day}`;
    return formattedDate;
  };
  const router = useRouter();
  return (
    <Box
      key={decodeHtml(item?.title?.rendered)}
      className="videocard-container column-center"
    // onClick={() => router.push()}
    >
      <Link  prefetch={false}
        href={`/news-and-events/${item.slug}`}
        passHref
        className="column-center"
        rel="noopener noreferrer"
      >

        <Typography className="video-date">{getDate(item?.date)}</Typography>
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
        <button className="row-center video-button">
          View more{" "}
          {/* <Image
          src="/images/right-white.svg"
          alt="pdf"
          width={20}
          height={20}
          className="right-arrow-view"
        />{" "} */}
        </button>
      </Link>
    </Box>
  );
};

export default NewsCardNew;
