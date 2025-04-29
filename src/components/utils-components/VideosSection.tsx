import {
  Box,
  ListItem,
  Pagination,
  PaginationItem,
  Typography,
} from "@mui/material";
import "./Videos.css";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Image from "next/image";
import DownloadCard from "./DownloadCard";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import VideoCard from "./Videocard";
import { NewsEvent } from "@/interface/NewsEvents";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { useQuery } from "@tanstack/react-query";
import { decodeHtml } from "@/utils/convertHtmltoArray";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
const VideosSection = ({
  title,
  id,
  item,
}: {
  title: string;
  id: number;
  item: NewsEvent | any;
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<NewsEvent>();
  const [page, setPage] = useState<number>(1);
  const [videos, setVideos] = useState<NewsEvent[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

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
      case "Price: Low to High":
        queryString = "&order=asc&orderby=price";
        break;
      case "Price: High to Low":
        queryString = "&order=desc&orderby=price";
        break;
      case "Newly Added":
        queryString = "&order=desc&orderby=date";
        break;
      case "Default":
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearchValue(value);
  };

  useEffect(() => {
    // //console.log("queryString", queryString);
    const fetch = async () => {
      const data = await fetchVideosTabData(searchValue, page, queryString);
      //console.log("DATA", data);
      setVideos(data);
    };
    fetch();
  }, [searchValue, page, queryString]);

  const handleSelectedVideo = (video: NewsEvent) => {
    setSelectedVideo(video);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchVideosTabData = async (
    searchStringParam: string,
    pageParam: number = 1,
    queryStringParam = ""
  ): Promise<NewsEvent[] | []> => {
    try {
      const response = await apiClient.get<NewsEvent[]>(
        `${API_ENDPOINT.GET.getNewsEvents}?per_page=12&page=${pageParam}&news-event-category=${item.id}&search=${searchStringParam}${queryStringParam}&status=publish`
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
    queryKey: ["videos", searchValue],
    queryFn: () => fetchVideosTabData(searchValue, page, queryString),
  });

  const fetchData = async (
    searchString: string,
    page: number,
    queryString: string
  ) => {
    //console.log(title, item);
    const videosCategoryData = await fetchVideosQuery.refetch();
    //console.log("VIDEO API CALLED", videosCategoryData.data);
    if (!videosCategoryData.data) return;
    setVideos(videosCategoryData.data);
  };

  return (
    <Box className="brochure-container">
      {!selectedVideo ? (
        <>
          <Typography
            className="brochure-title"
            sx={{
              color: customColors.darkBlueEbco,
            }}
          >
            {title}
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
                  className="w-100 custom-search-header-input"
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
            <Box className="cards-container">
              {videos.map((item, index) => {
                return (
                  <VideoCard
                    item={item}
                    key={index}
                    onViewMore={handleSelectedVideo}
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
            {totalPages > 1 && (
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
            )}
          </Box>
        </>
      ) : (
        <>
          <Box className="video-title row-space-between">
            <Box className="title-back">
              <ChevronLeftIcon
                width={12}
                height={12}
                className="video-back"
                sx={{
                  transform: ' rotate(0deg)'
                }}
                onClick={() => setSelectedVideo(undefined)}
              />
              <Typography
                className="video-title-text"
                sx={{
                  color: customColors.darkBlueEbco,
                }}
              >
                {decodeHtml(selectedVideo?.title?.rendered)}
              </Typography>
            </Box>
            <Box className="views-section row-center">
              <Image
                src={"/images/eye.svg"}
                alt="eye"
                width={20}
                height={20}
                className="video-stat"
              />
              <Typography className="stat">
                {" "}
                {selectedVideo?.acf?.views} Views
              </Typography>
            </Box>
          </Box>
          <Box
            className="column-center videos-details"
            dangerouslySetInnerHTML={{
              __html: selectedVideo?.content?.rendered,
            }}
          ></Box>
        </>
      )}
    </Box>
  );
};

export default VideosSection;
