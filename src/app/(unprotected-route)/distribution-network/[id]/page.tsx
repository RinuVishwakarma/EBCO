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
import "./DistributionNetwork.css";
import { DiscoveryCenter } from "@/interface/discoveryCenterIndia";

const NewsAndEventsId = () => {
  const [selectedItem, setSelectedItem] = useState<DiscoveryCenter | undefined>(
    undefined
  );
  const router = useRouter();
  const params = useParams();
  const fetchVideosTabData = async (): Promise<DiscoveryCenter | undefined> => {
    try {
      const response = await apiClient.get<DiscoveryCenter>(
        `${API_ENDPOINT.GET.getDistributorNetwork}/${params.id}?acf_format=standard`
      );

      if (!response || !response.data) {
        throw new Error("No data found");
      }
      let totalPages = response.headers["x-wp-totalpages"];
      setSelectedItem(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return undefined;
    }
  };
  const fetchVideosQuery = useQuery({
    queryKey: ["news-events-details"],
    queryFn: () => fetchVideosTabData(),
  });
  const openEmail = (emails: string) => {
    // Construct the mailto link
    const emailList = emails.split("/");

    // Extract the first email address
    const firstEmail = emailList[0];
    const subject = encodeURIComponent(" ");
    const body = encodeURIComponent(" ");
    const mailtoLink = `mailto:${firstEmail}?subject=${subject}&body=${body}`;
    // console.log(firstEmail)
    // return
    // Open the default email client with the mailto link
    window.open(mailtoLink, "_blank");
  };
  const openLocation = (latitude: string, longitude: string) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      "_blank"
    );
  };
  useEffect(() => {
    fetchVideosQuery.refetch();
    // setSelectedEvent(fetchVideosQuery.data);
  }, []);
  const getDiscoveryType = (item: DiscoveryCenter) => {
    // console.log(item['discovery-center-category'])

    if (item["discovery-center-category"].includes(757)) {
      return "National Display Center";
    } else if (item["discovery-center-category"].includes(758)) {
      return "City Display Center";
    } else if (item["discovery-center-category"].includes(760)) {
      return "International Display Center";
    } else {
      return "Discovery Center";
    }
  };
  return (
    <Box className="news-events-container" p={2}>
      {!fetchVideosQuery.isFetching && (
        <>
          <Box className="video-title row-space-between" mb={2}>
            <Box className="title-back">
              <Image
                src={"/images/right.svg"}
                alt="close"
                width={12}
                height={12}
                className="video-back"
                onClick={() => router.back()}
              />
              <Typography
                className="carousal-title-text"
                sx={{
                  color: customColors.darkBlueEbco,
                }}
              >
                {decodeHtml(selectedItem?.title?.rendered!)}
              </Typography>
            </Box>
          </Box>
          {/* {selectedEvent?.images?.length > 1 ? (
          <EventsCarousal selectedEvent={selectedEvent} />
        ) : (
          <Box className="column-center carousal-container-events-image">
            <img src={selectedEvent?.images[0]} className="carousal-image" />
          </Box>
        )} */}
          {selectedItem?.featured_media_src_url && (
            <Box className="column-center ">
              <img
                src={
                  selectedItem?.featured_media_src_url &&
                  selectedItem?.featured_media_src_url
                }
                className="news-images"
                style={{
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          {/* <div
            className="event-description"
            style={{
              padding: "1rem",
              textAlign: "justify",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedEvent?.content?.rendered!,
            }}
          /> */}
          <Box>
            <Typography
              sx={{
                fontFamily: "Uniform Medium",
                color: customColors.darkBlueEbco,
                fontSize: "18px",
                textAlign: "left !important",
              }}
              className="discovery_center_name"
            >
              {getDiscoveryType(selectedItem!)}
            </Typography>
            <Typography className="contact-person-details">
              {selectedItem?.acf?.contact_person}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Uniform Medium  !important",
                color: customColors.darkBlueEbco,
                fontSize: "18px",
                width: "80%",
                textAlign: "left !important",
              }}
              className="discovery_center_address"
            >
              <span
                className="call-details-text"
                style={{
                  marginRight: "0.5rem",
                }}
              >
                Address :
              </span>
              {selectedItem?.acf.address}
            </Typography>
          </Box>
          <Box
            className=""
            sx={{
              boxShadow: "none",
              margin: "0.25rem 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                // justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => window.open(`tel:${selectedItem?.acf?.phone}`)}
            >
              <Image
                src="/images/call.svg"
                alt="call"
                width={20}
                height={20}
                className="discovery_center_icon mobile-view"
              />
              <Typography className="call-details-text desktop-view">
                Phone:
              </Typography>
              <Typography className="call-details">
                {selectedItem?.acf?.phone}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                // justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => openEmail(selectedItem?.acf?.email!)}
            >
              <Image
                src="/images/email.svg"
                alt="email"
                width={20}
                height={20}
                className="discovery_center_icon mobile-view"
              />
              <Typography className="call-details-text desktop-view">
                Email:
              </Typography>
              <Typography className="call-details">
                {selectedItem?.acf?.email}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                // justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                openLocation(
                  selectedItem?.acf?.latitude!,
                  selectedItem?.acf?.longitude!
                )
              }
            >
              <Image
                src="/images/location.svg"
                alt="location"
                width={20}
                height={20}
                className="discovery_center_icon mobile-view"
              />
              <Typography className="call-details-text desktop-view">
                Phone:
              </Typography>
              <Typography className="call-details">View Location</Typography>
            </Box>
          </Box>
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
