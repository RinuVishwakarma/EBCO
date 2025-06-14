"use client";
import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import "./NewsEvents.css";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Image from "next/image";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useQuery } from "@tanstack/react-query";
import { NewsEvent, NewsEventData } from "@/interface/NewsEvents";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { useSearchParams } from "next/navigation";
import NewsCardNew from "@/components/utils-components/NewsCard";

const NewsEvents = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<NewsEventData | undefined>(
    undefined
  );
  const query = useSearchParams();
  const [page, setPage] = useState<number>(1);
  const [newsEventsData, setNewsEventsData] = useState<NewsEventData[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearchValue(value);
  };
  const handleSelectedEvent = (event: NewsEventData) => {
    setSelectedEvent(event);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const options = ["Name : A to Z", "Name : Z to A", "Newly Added"];
  const [selectedOption, setSelectedOption] = useState<string>("Newly Added");
  const [queryString, setQueryString] = useState<string>(
    "&order=desc&orderby=date"
  );
  const queryOptions = options.reduce((acc, option) => {
    let queryString = "";

    switch (option) {
      case "Name : A to Z":
        queryString = "&order=asc&orderby=title";
        break;
      case "Name : Z to A":
        queryString = "&order=desc&orderby=title";
        break;
      case "Newly Added":
        queryString = "&order=desc&orderby=date";
        break;
      default:
        queryString = "";
        break;
    }

    acc[option] = queryString;
    return acc;
  }, {} as Record<string, string>);

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement> | any
  ) => {
    const selected = event.target.value;
    setSelectedOption(selected);
    setQueryString(queryOptions[selected]);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  useEffect(() => {
    //console.log("page=======================", page, queryString);
    const fetchData = async (searchString: string) => {
      const videosCategoryData = await fetchVideosQuery.refetch();
    };
    fetchData(searchValue);
  }, [searchValue, page, queryString]);
  const fetchVideosTabData = async (
    searchString: string
  ): Promise<NewsEventData[] | []> => {
    try {
      const response = await apiClient.get<NewsEventData[]>(
        `${API_ENDPOINT.GET.getNewsEvents}?per_page=12&page=${page}&news-event-category=753&search=${searchString}${queryString}&status=publish`
      );

      if (!response || !response.data) {
        throw new Error("No data found");
      }
      let totalPages = response.headers["x-wp-totalpages"];
      if (totalPages) {
        setTotalPages(totalPages);
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return [];
    }
  };
  const fetchVideosQuery = useQuery({
    queryKey: ["news-events-details"],
    queryFn: () => fetchVideosTabData(searchValue),
  });
  useEffect(() => {
    const newsEventsId = query.get("newsEventsId");
    //console.log("NEWS CALLED", newsEventsId);

    if (newsEventsId) {
      let decodedTitle = decodeURIComponent(newsEventsId);
      //console.log("DECODED", decodedTitle);
      //console.log(newsEventsData, "DATAAAA");
      const filterData = newsEventsData.filter(
        (item) => item.title.rendered === decodedTitle
      );
      //console.log(filterData, "FILTERRRRR");
      if (filterData.length > 0) {
        setSelectedEvent(filterData[0]);
      }
    }
  }, [newsEventsData]);

  useEffect(() => {
    const fetchData = async () => {
      const videosCategoryData = await fetchVideosQuery.refetch();
      //console.log("videosCategoryData", videosCategoryData);
      setNewsEventsData(videosCategoryData.data!);
    };
    fetchData();
  }, [searchValue, page, queryString]);

  return (
    <Box className="brochure-container">
      <>
        <Typography
          className="brochure-title"
          sx={{
            color: customColors.darkBlueEbco,
          }}
        >
          NEWS & EVENTS
        </Typography>
        <Box className="brochure-wrapper">
          <Box className="search-filter-section row-space-between">
            <Box
              className="header-search-section row-center"
              sx={{
                margin: "0",
                border: `1px solid #ddd`,
                borderRadius: "50px",
                position: "relative",
                justifyContent: "flex-start",
                padding: "0.25rem 1rem",
              }}
            >
              <SearchIcon
                sx={{
                  color: customColors.darkBlueEbco,
                }}
              />

              <input
                type="text"
                name="search"
                value={searchValue}
                placeholder="Search"
                id="search"
                className="w-25 custom-search-header-input"
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
              {searchValue && (
                <CloseOutlinedIcon
                  sx={{
                    color: customColors.darkBlueEbco,
                    cursor: "pointer",
                    position: "absolute",
                    right: "1rem",
                    height: "16px",
                    width: "16px",
                  }}
                  onClick={() => {
                    setSearchValue("");
                  }}
                />
              )}
            </Box>
            <Box
              sx={{
                justifyContent: "flex-start",
              }}
              className="row-space-between sort-filter-section"
            >
              <Typography
                sx={{
                  width: "30%",
                  color: "#8D8D8D",
                }}
              >
                Sort by:
              </Typography>
              <select
                id="sort-by-select"
                style={{
                  padding: "0.5rem 1rem",
                  borderColor: customColors.selectBox,
                  fontSize: "16px !important",
                  fontFamily: "Uniform Medium",
                  color: customColors.darkBlueEbco,
                  borderRadius: "100px",
                }}
                value={selectedOption}
                onChange={handleSortChange}
              >
                {options.map((option) => (
                  <option
                    className="option-product"
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </Box>
          </Box>
          <Box className="cards-container-news">
            {!fetchVideosQuery.isFetching &&
              fetchVideosQuery.data?.map((item, index) => {
                return (
                  <NewsCardNew
                    item={item}
                    key={index}
                    onViewMore={handleSelectedEvent}
                  />
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
            count={totalPages}
            page={page}
            onChange={handleChange}
            color="standard"
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: WestIcon, next: EastIcon }}
                {...item}
              />
            )}
          />
        </Box>
      </>
    </Box>
  );
};

export default NewsEvents;
