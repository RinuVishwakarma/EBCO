import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import "./Brochure.css";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DownloadCard from "../DownloadCard";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import { DownloadBrochure } from "@/interface/DownloadBrochure";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { useQuery } from "@tanstack/react-query";
interface DownloadsTabItem {
  id: number;
  name: string;
}
const Brochure = ({ name, id }: DownloadsTabItem) => {
  const [searchValue, setSearchValue] = useState<string>("");
  // const [selectedVideo, setSelectedVideo] = useState<NewsEvent>();
  const [page, setPage] = useState<number>(1);
  const [downloads, setDownloads] = useState<DownloadBrochure[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPages1, setTotalPages1] = useState<number>(0)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearchValue(value);
  };
  const isInitialRender = useRef(true);

  // useEffect(() => {
  //   fetchData(searchValue);
  // }, [searchValue, page]);

  const options = ["Newly Added", "Name : A to Z", "Name : Z to A"];
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
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchVideosTabData = async (
    searchString: string
  ): Promise<DownloadBrochure[] | []> => {
    //console.log("id", id, "name ", name);
    try {
      const response = await apiClient.get<DownloadBrochure[]>(
        `${API_ENDPOINT.GET.getDownloadsBrochures}?per_page=12&page=${page}&downloads-category=${id}&search=${searchString}&acf_format=standard${queryString}`
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
    queryKey: ["downloads-query", searchValue],
    queryFn: () => fetchVideosTabData(searchValue),
  });

  const fetchData = async (searchString: string) => {
    //console.log(id, name);
    const videosCategoryData = await fetchVideosQuery.refetch();
    setTotalPages1(totalPages)

    //console.log("VIDEO API CALLED", videosCategoryData.data);
    if (!videosCategoryData.data) return;
    setDownloads(videosCategoryData.data);
  };
  useEffect(() => {
    // setDownloads([]);
    // return;
    //console.log("Called");
    fetchData(searchValue);
  }, [id, searchValue, page, queryString]);
  return (
    <Box className="brochure-container">
      <Typography
        className="brochure-title"
        sx={{
          color: customColors.darkBlueEbco,
        }}
      >
        {name}
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
                <option className="option-product" key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Box>
        </Box>
        <Box className="cards-container">
          {!fetchVideosQuery.isFetching &&
            fetchVideosQuery?.data?.map((item, index) => {
              //@ts-ignore
              return <DownloadCard item={item} key={index} />;
            })}
        </Box>
      </Box>
      {fetchVideosQuery.data && <Box
        className="row-center custom-pagination-container"
        sx={{
          margin: "3rem 0",
        }}
      >
        <Pagination
          count={Number(totalPages)}
          page={page}
          onChange={handleChange}
          color="standard"
          className="custom-pagination"
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: WestIcon, next: EastIcon }}
              {...item}
            />
          )}
        />
      </Box>}
    </Box>
  );
};

export default Brochure;
