"use client";
import { Box, Pagination, PaginationItem, Skeleton, Typography } from "@mui/material";
import "./Career.css";
import Image from "next/image";
import career, { CareerProp } from "@/utils/ProductData/career";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import { CareerCategory, CareerPost, CareersPage } from "@/interface/Careers";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { ebcoApiData } from "@/utils/ebcoApiData";
import { useQuery } from "@tanstack/react-query";
import { convertHtmltoArray, decodeHtml } from "@/utils/convertHtmltoArray";
import useDebounce from "@/hooks/useDebounce";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const fetchCareersCategoriesQuery = async (): Promise<CareerCategory[] | []> => {
  try {
    const response = await apiClient.get<CareerCategory[]>(
      `${API_ENDPOINT.GET.getCareersCategory}`
    );

    if (!response || !response.data) {
      throw new Error("No data found");
    }
    //console.log(response.data, "-=-=-=-000-=-=-");
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
interface TagInfo {
  tag: string;
  length: number;
}

const Career = () => {
  const [careerCategory, setCareerCategory] = useState<DownloadsObjectTabType>(
    {}
  );
  const [value, setValue] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<DownloadsTabItem | null>(null);
  const [careers, setcareers] = useState(career);
  const [searchValue, setSearchValue] = useState("");
  const searchValueDebounce = useDebounce<string>(searchValue, 100);
  const [isLoading, setIsLoading] = useState(true);
  const [careerTags, setCareerTags] = useState<TagInfo[] | []>([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [background, setBackground] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");
  const [careersData, setCareersData] = useState<CareerPost[] | []>([]);
  const router = useRouter();
  const targetSectionRef = useRef<HTMLDivElement>(null);
  const [totalCareers, setTotalCareers] = useState<number>(0);

  const handleCareerDetails = (id: number) => {
    ////console.log(id);
    router.push(`/careers/${id}`);
  };
  const fetchCareersDataApi = async (
    id: number
  ): Promise<CareerPost[] | []> => {
    //console.log("careersData called", id);
    setIsLoading(true);
    if (id === undefined) return [];
    try {
      const response = await apiClient.get<CareerPost[]>(
        `${API_ENDPOINT.GET.getCareers}?acf_format=standard${id !== 0 ? `&careers-category=${id}` : ""
        }&page=${page}&per_page=10&search=${searchValueDebounce}`
      );
      setIsLoading(false);
      if (!response || !response.data) {
        throw new Error("No data found");
      }
      let totalPages = response.headers["x-wp-totalpages"];
      let totalCareers = response.headers["x-wp-total"];

      if (totalPages) {
        setTotalPages(totalPages);
      }
      if (totalCareers) {
        setTotalCareers(totalCareers);
      }
      //console.log(response.data, "-=-=-=-=-=-=");

      return response.data;
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return [];
    }
  };
  useEffect(() => {
    // Calculate tag information
    const calculateTagInfo = () => {
      const tagInfo: TagInfo[] = careers.reduce(
        (acc: TagInfo[], careerItem: any) => {
          const { tag } = careerItem;
          const existingTagIndex = acc.findIndex((item) => item.tag === tag);
          if (existingTagIndex === -1) {
            acc.push({ tag, length: 1 });
          } else {
            acc[existingTagIndex].length++;
          }
          return acc;
        },
        []
      );
      setCareerTags(tagInfo);
    };

    calculateTagInfo();
  }, []);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };
  useEffect(() => {
    const currentTab = 0;
    setValue(Number(currentTab));
    fetchData();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSelectedCategory(careerCategory[newValue]);
    // window.history.pushState(null, "", `?tab=${newValue}`);
    // router.push(`/videos?tab=${newValue}`, undefined, { shallow: true });
  };

  const fetchVideosQuery = useQuery({
    queryKey: ["investorQuery"],
    queryFn: fetchCareersCategoriesQuery
  });

  const fetchData = async () => {
    const careersCategory = await fetchVideosQuery.refetch();

    if (careersCategory.data) {
      const downloadsTab: DownloadsObjectTabType = careersCategory.data.reduce(
        (acc, category, index) => {
          acc[index + 1] = {
            id: category.id,
            name: category.name,
          };
          return acc;
        },
        {} as DownloadsObjectTabType
      );
      const newCategory = {
        id: 0,
        name: "All",
      };

      const updatedCategories = { 0: newCategory, ...downloadsTab };
      //console.log(downloadsTab, "CHANGED CALLED");
      setCareerCategory(updatedCategories);
      setSelectedCategory(updatedCategories[0]);
      fetchCareersData.refetch();

    }
  };
  const fetchCareersData = useQuery({
    queryKey: ["CareersDataQuery"],
    queryFn: () => fetchCareersDataApi(selectedCategory?.id!),
  });

  const fetchCareersPage = async (): Promise<CareersPage | {}> => {
    try {
      const response = await apiClient.get<CareersPage>(
        `${API_ENDPOINT.GET.get_page}/${ebcoApiData.CAREER_PAGE_CODE}?acf_format=standard`
      );

      if (!response || !response.data) {
        throw new Error("No data found");
      }

      const { acf } = response.data;
      setBackground(acf.banner_image.url);
      setInfo(response.data.content.rendered);
      // setExcerpt(response.data.excerpt.rendered);
      //console.log(response.data, "-=-=-=-=-=-=-==");
      // setProductRanges(acf.carousel);
      // setVideo(acf.banner_video);
      // setIsVideoLoading(false);

      return response.data;
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return {}; // Return an empty object if an error occurs
    }
  };

  const careerPage = useQuery({
    queryKey: ["career-page"],
    queryFn: fetchCareersPage,
  });

  useEffect(() => {
    const fetchData = async () => {
      const careerData = await careerPage.data;
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!selectedCategory) return;
    //console.log(selectedCategory, "selectedCategory");
    const careersData = async () => {
      let data = await fetchCareersData.refetch();
      setCareersData(data.data!);
    };
    if (selectedCategory?.id !== undefined) {
      careersData();
    }
  }, [selectedCategory, page, searchValueDebounce]);

  function getCareerList(careerList: CareerPost[]) {
    return careerList.map((item, index) => {
      return (
        <Box
          className="career-list"
          key={index}
          onClick={() => {
            handleCareerDetails(item.id);
          }}
          sx={{
            cursor: "pointer",
          }}
        >
          <Typography className="career-list-title">
            {decodeHtml(item.title.rendered)}
          </Typography>
          <span className="row-space-between career-list-place-container">
            <Image
              src={"/images/careers/place.svg"}
              alt="place"
              width={20}
              height={20}
            />
            <span className="career-list-place"> {item.acf.location}</span>
          </span>
          <Box
            className="career-experience-degree-container row-space-between"
            sx={{
              justifyContent: "flex-start",
            }}
          >
            <Box className="row-space-between career-experience-container">
              <Image
                src={"/images/careers/user.svg"}
                alt="place"
                width={20}
                height={20}
              />
              <Typography className="career-experience">
                {" "}
                {item.acf.required_experience}
              </Typography>
            </Box>
            <Box
              className="row-space-between career-degree-container"
              sx={{
                marginLeft: "1rem",
              }}
            >
              <Image
                src={"/images/careers/degree.svg"}
                alt="place"
                width={20}
                height={20}
              />
              <Typography className="career-degree">
                {" "}
                {item.acf.required_education}
              </Typography>
            </Box>
          </Box>
          <Typography className="career-description">
            {convertHtmltoArray(item.content.rendered)}
          </Typography>
          <Box className="apply-btn-container">
            <button
              className="apply-btn row-center"
              onClick={() => {
                handleCareerDetails(item.id);
              }}
            >
              <Typography className="apply-btn-text">Apply now</Typography>
              <Image
                src={"/images/careers/arrow-right.svg"}
                alt="place"
                width={20}
                height={20}
              />{" "}
            </button>
          </Box>
        </Box>
      );
    });
  }

  return (
    <>
      {isLoading && (
        <Box className="loader-container">
          <Box className="loader"></Box>
        </Box>
      )}
      <Box>
        {!info && (
          <Skeleton
            className="hero-video-skeleton"
            variant="rectangular"
            width={"100%"}
            height={"100%"}
            animation="wave"
            sx={{ bgcolor: "grey.300" }}
          />
        )}
        {info && <Box className="career-banner row-space-between">
          <Box className="career-banner-text column-center" sx={{
            backgroundColor: customColors.darkBlueEbco
          }}>
            <div dangerouslySetInnerHTML={{ __html: info }}></div>
            <div dangerouslySetInnerHTML={{ __html: excerpt }}></div>
            {/* <button
            className="open-positions-btn row-center"
            onClick={() => {
              targetSectionRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Open Positions
            <Image
              src={"/images/arrow_down.svg"}
              alt="arrow"
              style={{ marginLeft: "0.5rem" }}
              width={20}
              height={20}
            />
          </button> */}
          </Box>

          <Box className="career-banner-image-container">
            <Image
              src={background}
              alt="banner"
              className="w-100 career-banner-image"
              width={500}
              height={500}
            />
            <Box className="w-100 career-banner-image-overlay"></Box>
          </Box>
        </Box>}
        {/* <Box className="great-place-benefits-container">
        <Box className="great-place-container">
          <Typography className="blue-text great-place-header">
            What make Ebco a great place to work?
          </Typography>
          <Box className="great-place-box-container">
            {greatPlace.map((item, index) => {
              return (
                <Box className="great-place-item" key={index}>
                  <Image
                    src={item.image}
                    alt="great place"
                    className="w-100 great-place-image"
                    width={100}
                    height={100}
                  />
                  <Box className="great-text-container">
                    <Typography className="blue-text great-title">
                      {item.title}
                    </Typography>
                    <Typography className="great-description">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box className="benefits-container">
          <Typography className="blue-text great-place-header">
            What benefits are waiting for you?
          </Typography>
          <Typography className="benefits-description">
            Ebco offers a variety of hand-picked benefits that you can take
            advantage of!
          </Typography>
          <Box className="benefits-icon-container">
            <Box className="benefits-icon-text row-space-between">
              <Image
                src={"/images/greatPlace/benefi-1.svg"}
                alt="benefits"
                width={40}
                height={40}
                className="benefits-icon"
              />
              <Typography className="benefits-icon-text-header">
                Competetive Salaries
              </Typography>
            </Box>
            <Box className="benefits-icon-text row-space-between">
              <Image
                src={"/images/greatPlace/benefi-2.svg"}
                alt="benefits"
                width={40}
                className="benefits-icon"
                height={40}
              />
              <Typography className="benefits-icon-text-header">
                Health care Insurance
              </Typography>
            </Box>
            <Box className="benefits-icon-text row-space-between">
              <Image
                src={"/images/greatPlace/benefi-3.svg"}
                alt="benefits"
                width={40}
                height={40}
                className="benefits-icon"
              />
              <Typography className="benefits-icon-text-header">
                Fun Team Events
              </Typography>
            </Box>
            <Box className="benefits-icon-text row-space-between">
              <Image
                src={"/images/greatPlace/benefi-4.svg"}
                alt="benefits"
                width={40}
                height={40}
                className="benefits-icon"
              />
              <Typography className="benefits-icon-text-header">
                Yearly Bonus
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <CareerGallery /> */}
        <Box
          ref={targetSectionRef}
          className="career-listing"
          sx={{
            backgroundColor: customColors.lightSkyBlue,
          }}
        >
          <Box className="row-space-between career-heading-banner">
            <Typography className="blue-text career-heading-text">
              WE HAVE {totalCareers} OPEN POSITIONS NOW!
            </Typography>
            <Box className="career-search-container row-center">
              <Image
                src={"/images/careers/search.svg"}
                alt="search"
                width={16}
                height={16}
              />
              <input
                type="text"
                name="career-search"
                id="career-search"
                className="career-search"
                value={searchValue}
                placeholder="Search"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Box>
          </Box>
          <Box className="careers-tabs-container desktop-view" sx={{}}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical"
              sx={{ borderRight: 1, borderColor: "divider" }}
              className="careers-custom-tabs"
            >
              {Object.keys(careerCategory).map((key) => {
                const index = Number(key);
                return (
                  <Tab
                    key={careerCategory[index].id}
                    label={careerCategory[index].name}
                    {...a11yProps(index)}
                    className="custom-tab"
                  />
                );
              })}
            </Tabs>
            <Box className="tab-panel-container">
              <TabPanel value={value} index={value}>
                {getCareerList(careersData)}
              </TabPanel>
            </Box>
          </Box>
          <Box className="careers-tab-container mobile-view">
            <Box className="select-container row-center">
              <select
                name="career-tags"
                id=""
                className="career-tags"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option
                  value="all"
                  className={selectedTag === "all" ? "active-select" : ""}
                >
                  All
                </option>
                {careerTags.map((tag, index) => (
                  <option
                    key={index}
                    value={tag.tag}
                    className={selectedTag === tag.tag ? "active-select" : ""}
                  >
                    {tag.tag}
                  </option>
                ))}
              </select>
            </Box>
            <Box className="mobile-career-listing">
              {careersData.map((item, index) => {
                return (
                  <Box
                    className="career-list"
                    key={index}
                    onClick={() => {
                      handleCareerDetails(item.id);
                    }}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <Typography className="career-list-title">
                      {decodeHtml(item.title.rendered)}
                    </Typography>
                    <span className="row-space-between career-list-place-container">
                      <Image
                        src={"/images/careers/place.svg"}
                        alt="place"
                        width={20}
                        height={20}
                      />
                      <span className="career-list-place">
                        {" "}
                        {item.acf.location}
                      </span>
                    </span>
                    <Box className="career-experience-degree-container row-space-between">
                      <Box className="row-space-between career-experience-container">
                        <Image
                          src={"/images/careers/user.svg"}
                          alt="place"
                          width={20}
                          height={20}
                        />
                        <Typography className="career-experience">
                          {" "}
                          {item.acf.required_experience}
                        </Typography>
                      </Box>
                      <Box className="row-space-between career-degree-container">
                        <Image
                          src={"/images/careers/degree.svg"}
                          alt="place"
                          width={20}
                          height={20}
                        />
                        <Typography className="career-degree">
                          {" "}
                          {item.acf.required_education}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography className="career-description">
                      {convertHtmltoArray(item.content.rendered)}
                    </Typography>
                    <Box className="apply-btn-container">
                      <button
                        className="apply-btn row-center"
                        onClick={() => {
                          handleCareerDetails(item.id);
                        }}
                      >
                        <Typography className="apply-btn-text">
                          Apply now
                        </Typography>
                        <Image
                          src={"/images/careers/arrow-right.svg"}
                          alt="place"
                          width={20}
                          height={20}
                        />{" "}
                      </button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box
            className="row-center custom-pagination-container"
            sx={{
              margin: "3rem 0",
            }}
          >
            <Pagination
              count={Number(totalPages)}
              page={Number(page)}
              onChange={handlePageChange}
              color="standard"
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: WestIcon, next: EastIcon }}
                  {...item}
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Career;
