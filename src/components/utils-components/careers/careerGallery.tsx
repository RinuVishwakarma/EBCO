import { Box, Typography } from "@mui/material";
import Image from "next/image";
import "@/components/module-components/Career/Career.css";
const CareerGallery = () => {
  return (
    <Box className="what-goes-at-ebco-container column-center">
      <Typography className="white-text great-place-header">
        Take a peep at what goes on at Ebco!
      </Typography>
      <Box className="ebco-image-gallery">
        <Image
          alt="ebco"
          src={"/images/greatPlace/gallery-1.svg"}
          width={500}
          height={500}
          className="w-100 gallery-image-benefits gallery-image-1"
        />
        <Image
          alt="ebco"
          src={"/images/greatPlace/gallery-4.svg"}
          width={500}
          height={500}
          className="w-100 gallery-image-benefits gallery-image-6 mobile-view"
        />
        <Image
          alt="ebco"
          src={"/images/greatPlace/gallery-5.svg"}
          width={500}
          height={500}
          className="w-100 gallery-image-benefits gallery-image-7 mobile-view"
        />

        <Image
          alt="ebco"
          src={"/images/greatPlace/gallery-2.svg"}
          width={500}
          height={500}
          className="w-100 gallery-image-benefits gallery-image-2"
        />

        <Image
          alt="ebco"
          src={"/images/greatPlace/gallery-3.svg"}
          width={500}
          height={500}
          className="w-100 gallery-image-benefits gallery-image-3"
        />

        <Image
          alt="ebco"
          src={"/images/greatPlace/gallery-6.svg"}
          width={500}
          height={500}
          className="w-100 gallery-image-benefits gallery-image-4"
        />

        <Image
          alt="ebco"
          src={"/images/greatPlace/gallery-4.svg"}
          width={500}
          height={500}
          className="w-100 gallery-image-benefits gallery-image-5"
        />
        {/* 
          <Image
            alt="ebco"
            src={"/images/greatPlace/gallery-6.svg"}
            width={500}
            height={500}
            className="w-100 gallery-image-benefits gallery-image-1"
          /> */}

        <Image
          alt="ebco"
          src={"/images/greatPlace/gallery-5.svg"}
          width={500}
          height={500}
          className="w-100 gallery-image-benefits gallery-image-6 desktop-view"
        />
        <Image
          alt="ebco"
          src={"/images/greatPlace/gallery-7.svg"}
          width={500}
          height={500}
          className="w-100 gallery-image-benefits gallery-image-7 desktop-view"
        />
      </Box>
    </Box>
  );
};

export default CareerGallery;
