import { Box, Typography } from "@mui/material";
import Image from "next/image";
import "./brochure/Brochure.css";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { DownloadBrochure } from "@/interface/DownloadBrochure";
import { decodeHtml } from "@/utils/convertHtmltoArray";
import Link from "next/link";

const DownloadCard = ({ item }: { item: DownloadBrochure | any }) => {
  return (
    <Box
      key={item.link}
      className="card-container column-center"
      sx={{
        cursor: "pointer",
      }}
    >
      <Link  prefetch={false}
        href={item.acf.pdf_file.toString()}
        passHref
        key={item.acf.pdf_file.toString()}
        className="column-center"
        rel="noopener noreferrer"
        target="_blank"
      >

        {item.featured_media_src_url && (
          <Image
            src={item.featured_media_src_url}
            className="card-image"
            alt={item.title.rendered}
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
          {decodeHtml(item.title.rendered)}
        </Typography>
        <button
          className="row-center download-button"
        >
          View PDF{" "}
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

export default DownloadCard;
