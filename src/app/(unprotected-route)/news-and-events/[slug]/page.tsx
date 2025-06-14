"use client";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { apiClient } from "@/apiClient/apiService";
import { NewsEventData } from "@/interface/NewsEvents";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { decodeHtml } from "@/utils/convertHtmltoArray";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/components/module-components/NewsEvents/NewsEvents.css";
import MyEventsCarousal from "@/components/utils-components/MyEventsCarousal";

const NewsAndEventsId = () => {
  const [selectedEvent, setSelectedEvent] = useState<NewsEventData | undefined>(
    undefined
  );
  const [renderingContent, setRenderingContent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();
  const params = useParams();
  const fetchVideosTabData = async (): Promise<NewsEventData | undefined> => {
    try {
      const response = await apiClient.get<NewsEventData[]>(
        `${API_ENDPOINT.GET.getNewsEvents}?slug=${params.slug}&acf_format=standard`
      );

      if (!response?.data || response.data.length === 0) {
        throw new Error("No data found");
      }

      const data = response.data[0]; // Get the first item since we're querying by slug
      let totalPages = response.headers["x-wp-totalpages"];
      // Extract src attributes from img tags
      const imgSrcs = Array.from(
        data.content.rendered.matchAll(
          /<img[^>]*src="([^"]+)"[^>]*>/g
        ),
        (match) => (match as RegExpMatchArray)[1]
      );

      // Remove img tags from input string
      const remainingString = data.content.rendered.replace(
        /<img[^>]*>/g,
        ""
      );
      imgSrcs.unshift(data.featured_media_src_url);
      setImages(imgSrcs);
      if (data.acf.image_gallery) {
        let images = data.acf.image_gallery;
        setImages((prev) => [...prev, ...images]);
      }
      setRenderingContent(remainingString);
      setSelectedEvent(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return undefined;
    }
  };
  const fetchVideosQuery = useQuery({
    queryKey: ["news-events-details"],
    queryFn: () => fetchVideosTabData(),
  });
  useEffect(() => {
    fetchVideosQuery.refetch();
    // setSelectedEvent(fetchVideosQuery.data);
  }, []);
  return (
    <Box className="news-events-container" p={2}>
      {!fetchVideosQuery.isFetching && (
        <>
          <Box className="video-title row-space-between" mb={2}>
            <Box className="title-back">
              {/* <Image
                src={"/images/right.svg"}
                alt="close"
                width={12}
                height={12}
                className="video-back"
                onClick={() => router.back()}
              /> */}
              <Typography
                className="carousal-title-text"
                sx={{
                  color: customColors.darkBlueEbco,
                }}
              >
                {decodeHtml(selectedEvent?.title?.rendered!)}
              </Typography>
            </Box>
          </Box>
          {images.length > 1 ? (
            <MyEventsCarousal images={images} />
          ) : (
            <Box className="column-center carousal-container-events-image w-100">
              <img
                src={selectedEvent?.featured_media_src_url}
                className="carousal-image w-50"
              />
            </Box>
          )}
          {/* {selectedEvent?.featured_media_src_url && (
            <Box className="column-center ">
              <img
                src={
                  selectedEvent?.featured_media_src_url &&
                  selectedEvent?.featured_media_src_url
                }
                className="news-images"
                style={{
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          )} */}
          <div
            className="event-description"
            style={{
              padding: "1rem",
              textAlign: "justify",
            }}
            dangerouslySetInnerHTML={{
              __html: renderingContent!,
            }}
          />
        </>
      )}
      {fetchVideosQuery.isFetching && (
        <Box sx={{ textAlign: "center", minHeight: "90vh" }}>
          <Box className="loader-container">
            <Box className="loader"></Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NewsAndEventsId;
