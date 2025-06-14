"use client";
import { Box, Skeleton, Typography, Tab, Tabs } from "@mui/material";
// import AboutUsGif from "../../../../public/gifs/about_us.gif";
import "./Initiative.css";
import React, { useEffect, useRef, useState } from "react";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Image from "next/image";
import { InitiativePage } from "@/interface/Initiative";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { ebcoApiData } from "@/utils/ebcoApiData";
import { CarouselItem } from "@/interface/Sustainability";
import { useQuery } from "@tanstack/react-query";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="initiative-custom-tab" sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const fetchInitiativesData = async (): Promise<InitiativePage | {}> => {
  try {
    //console.log("fetchSustainabilityData called");
    const response = await apiClient.get<InitiativePage>(
      `${API_ENDPOINT.GET.get_page}/${ebcoApiData.INITIATIVES}?acf_format=standard`
    );
    //console.log(response);
    if (!response || !response.data) {
      throw new Error("No data found");
    }

    const { acf } = response.data;

    if (!acf || !acf.carousel || !acf.banner_image) {
      throw new Error("Incomplete ACF data");
    }

    //console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch new arrival data:", error);
    return {}; // Return an empty object if an error occurs
  }
};

const Initiative = () => {
  const columnSizes = [
    { gridColumn: "span 3" }, // 1st row, 1st image takes 3 columns
    { gridColumn: "span 2" }, // 1st row, 2nd image takes 2 columns
    { gridColumn: "span 2" }, // 2nd row, 1st image takes 2 columns
    { gridColumn: "span 3" }, // 2nd row, 2nd image takes 3 columns
    // Add more column sizes as needed
  ];
  const [value, setValue] = React.useState(0);
  const [bannerMedia, setBannerMedia] = useState<string>("");
  const [bannerText, setBannerText] = useState<string>("");
  const [initiative, setInitiative] = useState<CarouselItem[]>([]);
  const tabListRef = useRef<HTMLDivElement>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const initiativesQuery = useQuery({
    queryKey: ["initiatives-page"],
    queryFn: fetchInitiativesData,
  });

  const isWordPressPage = (data: any): data is InitiativePage => {
    return data && typeof data === "object" && "acf" in data;
  };


  useEffect(() => {

    fetchData();
  }, []);
  const fetchData = async () => {
    const aboutUsData = await initiativesQuery.refetch();

    if (aboutUsData && isWordPressPage(aboutUsData.data)) {
      const banner_video = aboutUsData.data.acf;
      const bannerText = aboutUsData.data.content.rendered;
      setInitiative([...aboutUsData.data.acf.carousel]);
      setBannerMedia(banner_video.banner_image.url);
      setBannerText(bannerText);
      setGallery(aboutUsData.data.acf.gallery);
    }
  };


  return (
    <Box sx={{
      minHeight: '100vh'
    }}>
      <Box
        className="initiatives-text-container"
        dangerouslySetInnerHTML={{ __html: bannerText }}
      ></Box>

      <Box className={"tab-list"} ref={tabListRef}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          className="initiatives-scrollabletabs"
        >
          {initiative.map((item, index) => (
            <Tab
              key={index}
              {...a11yProps(index)}
              className=" initiative-tab"
              label={
                <Box className="row-center custom-tab-box">
                  <Box className="custom-tab-container column-space-between">
                    <Image
                      src={item.logo}
                      alt={item.card_title}
                      width={55}
                      height={55}
                      className="custom-tab-logo tab-icon"
                    />
                    <Typography className={`custom-tab-header`}>
                      {item.card_title}
                    </Typography>
                    <Typography className={`custom-tab-description`}>
                      {item.card_description}
                    </Typography>
                  </Box>
                </Box>
              }
            />
          ))}

        </Tabs>
      </Box>
      {initiative.map((item, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          <Box className="tab-content">
            <Box className="content-text">
              <Typography className="desc-header">{item.title}</Typography>
              <Typography
                className="desc-body"
                dangerouslySetInnerHTML={{ __html: item.content }}
              ></Typography>
            </Box>
            <Box className="content-Image">
              <Image
                src={item.image}
                alt={`${item.title} image`}
                width={700}
                height={300}
                className="content-image"
              />
              <Box className="overlay-image"></Box>
            </Box>
          </Box>
        </CustomTabPanel>
      ))}
      <Box className="gallery-container">
        <Box className="gallery-header">
          <Typography className="gallery-header-text">
            MORE <span style={{ fontFamily: "Uniform Bold" }}>PICTURES</span>
          </Typography>
        </Box>
        <Box className="gallery">
          {gallery.map((image, index) => (
            <Box
              key={index}
              className="gallery-image-container"
              style={columnSizes[index % columnSizes.length]} // Apply dynamic column size
            >
              <Image
                src={image}
                alt={image}
                className="gallery-image"
                width={700}
                height={700}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Initiative;
