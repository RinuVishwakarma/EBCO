"use client";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { apiClient } from "@/apiClient/apiService";
import { PrivacyPage } from "@/interface/PrivacyPolicy";
import { ebcoApiData } from "@/utils/ebcoApiData";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "../PrivacyPolicy/PrivacyPolicy.css";

const ShippingDelivery = () => {
  const [privacyContent, setPrivacyContent] = useState<string>("");
  const fetchPrivacyPage = async (): Promise<PrivacyPage | {}> => {
    try {
      const response = await apiClient.get<PrivacyPage>(
        `${API_ENDPOINT.GET.get_page}/${ebcoApiData.SHIPPING_AND_DELIVERY}?acf_format=standard`
      );

      if (!response || !response.data) {
        throw new Error("No data found");
      }

      setPrivacyContent(response.data.content.rendered);

      // setProductRanges(acf.carousel);
      // setVideo(acf.banner_video);
      // setIsVideoLoading(false);

      return response.data;
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return {}; // Return an empty object if an error occurs
    }
  };
  const homePageQuery = useQuery({
    queryKey: ["privacy-page"],
    queryFn: fetchPrivacyPage,
  });
  useEffect(() => {
    //console.log("privacy page", homePageQuery.data);
    homePageQuery.refetch();
  }, []);
  return (
    <Box>
      {homePageQuery.isLoading && (
        <Box className="loader-container">
          <Box className="loader"></Box>
        </Box>
      )}
      {homePageQuery.isLoading && !homePageQuery.data && (
        <Box
          className="container"
          sx={{
            minHeight: "100vh",
          }}
        ></Box>
      )}
      <div
        dangerouslySetInnerHTML={{
          __html: privacyContent,
        }}
        className="PrivacyPolicy"
      ></div>
    </Box>
  );
};

export default ShippingDelivery;
