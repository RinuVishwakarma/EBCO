"use client";
import OverlayWrapper from "@/components/utils-components/OverlayWrapper";
import { Box, Typography } from "@mui/material";
import "./Investor.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import {
  InvestorRelation,
  InvestorRelationsCategory,
} from "@/interface/InvestorRelations";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { ebcoApiData } from "@/utils/ebcoApiData";
import { InvestorPage } from "@/interface/InvestorPage";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const fetchInvestorCategories = async (): Promise<
  InvestorRelationsCategory[] | []
> => {
  try {
    const response = await apiClient.get<InvestorRelationsCategory[]>(
      `${API_ENDPOINT.GET.getinvestorRelationCategories}`
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

const fetchInvestorPage = async (): Promise<InvestorPage | {}> => {
  try {
    // //console.log("fetchInvestorPage called");
    const response = await apiClient.get<InvestorPage>(
      `${API_ENDPOINT.GET.get_page}/${ebcoApiData.INVESTOR_PAGE}?acf_format=standard`
    );
    // //console.log(response);
    if (!response || !response.data) {
      throw new Error("No data found");
    }

    // //console.log(response.data);

    return response.data;
  } catch (error) {
    // console.logerror("Failed to fetch new arrival data:", error);
    return {}; // Return an empty object if an error occurs
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
interface InvestorData {
  id: number;
  title: string;
  download: string;
}
interface n {
  id: number;
  date: string; // ISO 8601 date string
  date_gmt: string; // ISO 8601 date string
  guid: {
    rendered: string;
  };
  modified: string; // ISO 8601 date string
  modified_gmt: string; // ISO 8601 date string
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  parent: number;
  template: string;
  meta: {
    _acf_changed: boolean;
  };
  "investor-relations-category": number[];
  acf: {
    sub_title: string;
    file: string;
  };
  jetpack_sharing_enabled: boolean;
  featured_media_src_url: string | null;
  _links: {
    self: {
      href: string;
    }[];
    collection: {
      href: string;
    }[];
    about: {
      href: string;
    }[];
    "wp:attachment": {
      href: string;
    }[];
    "wp:term": {
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }[];
    curies: {
      name: string;
      href: string;
      templated: boolean;
    }[];
  };
}

const fetchInvestorData = async (id: number): Promise<InvestorData[] | []> => {
  //console.log("fetchInvestorData called", id);
  if (!id) return [];
  try {
    const response = await apiClient.get<InvestorRelation[]>(
      `${API_ENDPOINT.GET.getInvestorData}?acf_format=standard&investor-relations-category=${id}`
    );

    if (!response || !response.data) {
      throw new Error("No data found");
    }

    //console.log(response.data, "-=-=-=-=-=-=");

    return response.data.map((item: InvestorRelation) => ({
      id: item.id,
      title: item.title.rendered,
      download: item.acf.file,
    }));
  } catch (error) {
    console.error("Failed to fetch new arrival data:", error);
    return [];
  }
};
const Investor = () => {
  const [investorCategory, setInvestorCategory] =
    useState<DownloadsObjectTabType>({});
  const [value, setValue] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<DownloadsTabItem | null>(null);
  const [bannerText, setBannerText] = useState<string>("");

  const [investorData, setInvestorData] = useState<InvestorData[]>([]);
  // const query =
  const query = useSearchParams();
  const isWordPressPage = (data: any): data is InvestorPage => {
    return data && typeof data === "object" && "acf" in data;
  };

  useEffect(() => {
    const currentTab = 0;
    setValue(Number(currentTab));
    fetchData();
    const fetch = async () => {
      const response = await investorQuery.refetch();
      if (response && isWordPressPage(response.data)) {
        setBannerText(response.data.content.rendered);
      }
    };
    fetch();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSelectedCategory(investorCategory[newValue]);
    // window.history.pushState(null, "", `?tab=${newValue}`);
    // router.push(`/videos?tab=${newValue}`, undefined, { shallow: true });
  };

  const fetchVideosQuery = useQuery({
    queryKey: ["investorQuery"],
    queryFn: fetchInvestorCategories,
  });
  const fetchInvestorDataQuery = useQuery({
    queryKey: ["investorDataQuery"],
    queryFn: () => fetchInvestorData(selectedCategory?.id!),
  });

  const investorQuery = useQuery({
    queryKey: ["investor-page"],
    queryFn: fetchInvestorPage,
  });

  const fetchData = async () => {
    const investorCategoryData = await fetchVideosQuery.refetch();

    if (investorCategoryData.data) {
      const downloadsTab: DownloadsObjectTabType =
        investorCategoryData.data.reduce((acc, category, index) => {
          acc[index] = {
            id: category.id,
            name: category.name,
          };
          return acc;
        }, {} as DownloadsObjectTabType);

      setInvestorCategory(downloadsTab);
      setSelectedCategory(downloadsTab[0]);
      fetchInvestorDataQuery.refetch();
      setTimeout(() => {
        //console.log(investorCategory[value], "CHANGED CALLED");
      }, 1000);
    }
  };

  useEffect(() => {
    if (!selectedCategory) return;
    //console.log(selectedCategory, "selectedCategory");
    const fetchInvestorData = async () => {
      let data = await fetchInvestorDataQuery.refetch();
      //console.log(data.data, "-=-=-=-=data");
      setInvestorData(data.data!);
    };
    if (selectedCategory?.id !== undefined) {
      //console.log("fetchInvestorData called", selectedCategory?.id);
      fetchInvestorData();
    }
  }, [selectedCategory]);
  const getInvestors = (data: InvestorData[]) => {
    //console.log(data, "data I AM GETTING");
    return (
      <Box className="investor-container">
        {data.map((item, index) => {
          return (
            <Box className="investor-content" key={index}>
              {/* <Typography className="investor-year-text">FY</Typography> */}
              <Typography className="investor-year">{item.title}</Typography>
              {item.download && (
                <FileDownloadOutlinedIcon
                  onClick={() => {
                    downloadPDF(item.download);
                  }}
                  className="investor-icon"
                  sx={{
                    color: customColors.orangeEbco
                  }}
                  width={20}
                  height={20}
                />
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  function downloadPDF(pdfLink: string) {
    // Create a temporary anchor element
    const anchor = document.createElement("a");
    anchor.style.display = "none"; // Hide the anchor element

    // Set the href attribute to the PDF link
    anchor.href = pdfLink;
    anchor.target = "_blank";

    // Set the download attribute to specify the filename (optional)
    anchor.download = "document.pdf";

    // Append the anchor to the document body
    document.body.appendChild(anchor);

    // Trigger a click event on the anchor
    anchor.click();

    // Remove the anchor from the document body
    document.body.removeChild(anchor);
  }


  return (
    <Box className="investor-container-wrapper">
      {/* <OverlayWrapper media={"/images/investor_banner.png"} isVideo={false}> */}
      <Box
        className="investor-text-container"
        dangerouslySetInnerHTML={{ __html: bannerText }}
      ></Box>
      {/* </OverlayWrapper> */}
      <Box
        className="investors-description-tabs-container desktop-view"
        sx={{}}
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
          {Object.keys(investorCategory).map((key) => {
            const index = Number(key);
            return (
              <Tab
                key={investorCategory[index].id}
                label={investorCategory[index].name}
                {...a11yProps(index)}
                className="custom-tab investor-tab"
              />
            );
          })}
        </Tabs>
        {Object.keys(investorCategory).map((key) => {
          const index = Number(key);
          return (
            <TabPanel key={index.toString()} value={value} index={index}>
              {getInvestors(investorData)}
            </TabPanel>
          );
        })}
      </Box>
      <Box sx={{ width: "100%" }} className="mobile-view" mt={3}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            className="myProfile-scrollabletabs row-center"
          >
            {Object.keys(investorCategory).map((key) => {
              const index = Number(key);
              return (
                <Tab
                  key={investorCategory[index].id}
                  label={investorCategory[index].name}
                  {...a11yProps(index)}
                  className="custom-tab"
                />
              );
            })}
          </Tabs>
        </Box>
        {Object.keys(investorCategory).map((key) => {
          const index = Number(key);
          return (
            <CustomTabPanel key={index.toString()} value={value} index={index}>
              {getInvestors(investorData)}
            </CustomTabPanel>
          );
        })}
      </Box>
    </Box>
  );
};

export default Investor;
