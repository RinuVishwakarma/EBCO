"use client";
import { Box, Typography } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import NewsEvents from "@/components/utils-components/NewsEvents";
import VideosSection from "@/components/utils-components/VideosSection";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { NewsEventCategory } from "@/interface/VideosTab";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { apiClient } from "@/apiClient/apiService";
import { useQuery } from "@tanstack/react-query";
import "./Videos.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const fetchVideosTabData = async (): Promise<NewsEventCategory[] | []> => {
  try {
    const response = await apiClient.get<NewsEventCategory[]>(
      `${API_ENDPOINT.GET.getVideosTable}`
    );

    if (!response || !response.data) {
      throw new Error("No data found");
    }

    return response.data;
  } catch (error) {
    console.error("Failed to fetch new arrival data:", error);
    return [];
  }
};
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className="custom-tab-panel"
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
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
        <Box sx={{ p: 0 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}
interface DownloadsTabItem {
  id: number;
  name: string;
}
interface DownloadsObjectTabType {
  [index: number]: DownloadsTabItem;
}
const Videos = () => {
  const [value, setValue] = useState(0);
  const query = useSearchParams();
  const [videosCategory, setVideosCategory] = useState<DownloadsObjectTabType>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    const currentTab = query?.get("tab") || 0;
    setValue(Number(currentTab));
    fetchData();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    window.history.pushState(null, "", `?tab=${newValue}`);
    // router.push(`/videos?tab=${newValue}`, undefined, { shallow: true });
  };

  const fetchVideosQuery = useQuery({
    queryKey: ["videosCategory"],
    queryFn: fetchVideosTabData,
  });

  const fetchData = async () => {
    const videosCategoryData = await fetchVideosQuery.refetch();

    if (videosCategoryData.data) {
      //console.log(videosCategoryData.data, "videosCategoryData");
      let filteredData = videosCategoryData.data.filter(
        (item) => item.name !== "News And Events"
      );
      const downloadsTab: DownloadsObjectTabType = filteredData.reduce(
        (acc, category, index) => {
          acc[index] = {
            id: category.id,
            name: category.name,
          };
          return acc;
        },
        {} as DownloadsObjectTabType
      );
      //console.log(downloadsTab, "downloadsTab");

      setVideosCategory(downloadsTab);
    }
  };

  return (
    <Box className="video-news-container">
      <Box className="description-tabs-container desktop-view">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical"
          sx={{ borderRight: 1, borderColor: "divider" }}
          className="custom-video-tabs video-tabs"
        >
          {Object.keys(videosCategory).map((key) => {
            const index = Number(key);
            return (
              <Tab
                key={videosCategory[index].id}
                label={videosCategory[index].name}
                {...a11yProps(index)}
                className="custom-tab"
              />
            );
          })}
        </Tabs>
        {!fetchVideosQuery.isLoading &&
          Object.keys(videosCategory).map((key) => {
            const index = Number(key);
            const category = videosCategory[index];
            return (
              <TabPanel key={category.id} value={value} index={index}>
                {category.name.toLowerCase() === "news and events" ? (
                  <Suspense
                    fallback={
                      <div
                        className="new-arrival-loader"
                        style={{
                          height: "80vh",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      ></div>
                    }
                  >
                    <NewsEvents
                      title={category.name}
                      id={category.id}
                      item={videosCategory[value]}
                    />
                  </Suspense>
                ) : (
                  <VideosSection
                    title={category.name}
                    id={category.id}
                    item={videosCategory[value]}
                  />
                )}
              </TabPanel>
            );
          })}
      </Box>
      <Box
        sx={{ width: "100%", flexDirection: "column" }}
        className="description-tabs-container mobile-view"
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label=""
            className="relations-tabs"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            {Object.keys(videosCategory).map((key) => {
              const index = Number(key);
              return (
                <Tab
                  key={videosCategory[index].id}
                  label={videosCategory[index].name}
                  {...a11yProps(index)}
                  className="custom-tab"
                />
              );
            })}
          </Tabs>
        </Box>
        {Object.keys(videosCategory).map((key) => {
          const index = Number(key);
          const category = videosCategory[index];
          return (
            <CustomTabPanel key={category.id} value={value} index={index}>
              {category.name.toLowerCase() === "news and events" ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <NewsEvents
                    title={category.name}
                    id={category.id}
                    item={videosCategory[value]}
                  />
                </Suspense>
              ) : (
                <VideosSection
                  title={category.name}
                  id={category.id}
                  item={videosCategory[value]}
                />
              )}
            </CustomTabPanel>
          );
        })}
      </Box>
    </Box>
  );
};

export default Videos;
