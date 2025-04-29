"use client";
import OverlayWrapper from "@/components/utils-components/OverlayWrapper";
import { Box, Skeleton, Typography, Tab, Tabs } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Image from "next/image";
import { WordPressSustainabilityPage } from "@/interface/Sustainability";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { ebcoApiData } from "@/utils/ebcoApiData";
import { useQuery } from "@tanstack/react-query";
import { CarouselItem } from "@/interface/Sustainability";
import "./sustainabiltiy.css";

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
      style={{
        backgroundColor: '#f9f9f9'
      }}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}


const fetchSustainabilityData = async (): Promise<
  WordPressSustainabilityPage | {}
> => {
  try {
    //console.log("fetchSustainabilityData called");
    const response = await apiClient.get<WordPressSustainabilityPage>(
      `${API_ENDPOINT.GET.get_page}/${ebcoApiData.SUSTAINABILITY_CODE}?acf_format=standard`
    );
    //console.log(response);
    if (!response || !response.data) {
      throw new Error("No data found");
    }

    const { acf } = response.data;

    if (!acf || !acf.carousel || !acf.banner_video) {
      throw new Error("Incomplete ACF data");
    }

    //console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch new arrival data:", error);
    return {}; // Return an empty object if an error occurs
  }
};

const Sustainability = () => {
  const columnSizes = [
    { gridColumn: "span 3" },
    { gridColumn: "span 2" },
    { gridColumn: "span 2" },
    { gridColumn: "span 3" },
  ];
  const [value, setValue] = React.useState(0);
  const [bannerMedia, setBannerMedia] = useState<string>("");
  const [bannerText, setBannerText] = useState<string>("");
  const [sustainability, setSustainability] = useState<CarouselItem[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const tabListRef = useRef<HTMLDivElement>(null);

  const [gallery, setGallery] = useState<string[]>([]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const sustainabilityQuery = useQuery({
    queryKey: ["about-us-page"],
    queryFn: fetchSustainabilityData,
  });

  const isWordPressPage = (data: any): data is WordPressSustainabilityPage => {
    return data && typeof data === "object" && "acf" in data;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (tabListRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
      }
    };

    if (tabListRef.current) {
      tabListRef.current.addEventListener("scroll", handleScroll);
      handleScroll(); // Check arrows initially
    }
  }, [sustainability]);


  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const aboutUsData = await sustainabilityQuery.refetch();

    if (aboutUsData && isWordPressPage(aboutUsData.data)) {
      const banner_video = aboutUsData.data.acf;
      const bannerText = aboutUsData.data.content.rendered;
      setSustainability([...aboutUsData.data.acf.carousel]);
      setBannerMedia(banner_video.banner_video.url);
      setBannerText(bannerText);
      setGallery(aboutUsData.data.acf.gallery);
    }
  };

  return (
    <Box>
      {!bannerMedia ? (
        <div
          className="hero-section"
          style={{
            height: "100vh",
          }}
        >
          <Skeleton
            className="video-skeleton"
            variant="rectangular"
            width={"100%"}
            height={"100%"}
            animation="pulse"
            sx={{ bgcolor: "grey.400" }}
          />
        </div>
      ) : (
        <OverlayWrapper media={bannerMedia} isVideo={true}>
          <Box
            className="sustainability-text-container"
            dangerouslySetInnerHTML={{ __html: bannerText }}
          ></Box>
        </OverlayWrapper>
      )}

      <Box className={"tab-list"} ref={tabListRef}>
        <Box className="custom-tablist">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            className="sustain-scrollabletabs"
          >
            {sustainability.map((item, index) => (
              <Tab
                className={`custom-tab sustain-tab column-space-between`}
                key={index}
                label={
                  <Box className="row-center custom-tab-box">
                    <Box className="custom-tab-container column-space-between">
                      <Image
                        src={item.logo}
                        alt={item.card_title}
                        width={55}
                        height={55}
                        className={`tab-icon`}
                      />
                      <Typography className={`custom-tab-header `}>
                        {item.card_title}
                      </Typography>
                      <Typography className={`custom-tab-description`}>
                        {item.card_description}
                      </Typography>
                    </Box>
                  </Box>
                }
              ></Tab>
            ))}
          </Tabs>
        </Box>
      </Box>

      {sustainability.map((item, index) => (
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
          {gallery?.map((image, index) => (
            <Box
              key={index}
              className="gallery-image-container"
              style={columnSizes[index % columnSizes.length]}
            >
              <Image
                src={image}
                alt={image}
                className="gallery-image"
                width={900}
                height={900}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Sustainability;
