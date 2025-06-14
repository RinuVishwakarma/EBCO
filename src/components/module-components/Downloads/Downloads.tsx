"use client";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./Downloads.css";
import Brochure from "@/components/utils-components/brochure/Brochure";
import {
  DownloadBrochure,
  DownloadsCategory,
} from "@/interface/DownloadBrochure";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const fetchVideosTabData = async (): Promise<DownloadsCategory[] | []> => {
  try {
    const response = await apiClient.get<DownloadsCategory[]>(
      `${API_ENDPOINT.GET.getDownloadsCategory}`
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

const Downloads = () => {
  const [value, setValue] = useState(0);
  const [videosCategory, setVideosCategory] = useState<DownloadsObjectTabType>(
    {}
  );
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const query = useSearchParams();

  useEffect(() => {
    const currentTab = query?.get("tab") || 0;
    setValue(Number(currentTab));
    fetchData();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    window.history.pushState(null, "", `?tab=${newValue}`);
  };

  const fetchVideosQuery = useQuery({
    queryKey: ["downloadsQuery"],
    queryFn: fetchVideosTabData,
  });

  const fetchData = async () => {
    const videosCategoryData = await fetchVideosQuery.refetch();

    if (videosCategoryData.data) {
      const downloadsTab: DownloadsObjectTabType =
        videosCategoryData.data.reduce((acc, category, index) => {
          acc[index] = {
            id: category.id,
            name: category.name,
          };
          return acc;
        }, {} as DownloadsObjectTabType);

      setVideosCategory(downloadsTab);
    }
  };

  const desktopView = (
    <Box
      className="description-tabs-container desktop-view"
      sx={{
        display: "flex",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical"
        sx={{ borderRight: 1, borderColor: "divider" }}
        className="custom-tabs"
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
              {
                <Suspense fallback={<div>Loading...</div>}>
                  <Brochure
                    name={videosCategory[value]?.name}
                    id={videosCategory[value]?.id}
                  />
                </Suspense>
              }
            </TabPanel>
          );
        })}
    </Box>
  );

  const mobileView = (
    <Box
      sx={{ width: "100%" }}
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
      {!fetchVideosQuery.isLoading &&
        Object.keys(videosCategory).map((key) => {
          const index = Number(key);
          const category = videosCategory[index];
          return (
            <CustomTabPanel key={category.id} value={value} index={index}>
              {
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
                  <Brochure
                    name={videosCategory[value]?.name}
                    id={videosCategory[value]?.id}
                  />
                </Suspense>
              }
            </CustomTabPanel>
          );
        })}
    </Box>
  );

  return (
    <Box className="download-container">
      {isSmallScreen ? mobileView : desktopView}
    </Box>
  );
};

export default Downloads;
