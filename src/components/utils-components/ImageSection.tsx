import { Box, Typography } from "@mui/material";
import Image from "next/image";

const ImageSection = ({ imageProp }: any) => {
  return (
    <Box className="imageSection" sx={{ width: "50%", height: "auto" }}>
      <Image
        src={imageProp}
        alt="ebco logo"
        width={300}
        height={300}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Box>
  );
};

export default ImageSection;
