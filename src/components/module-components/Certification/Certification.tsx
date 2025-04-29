"use client";
import { Box, Typography } from "@mui/material";
import "./Certification.css";
import Image from "next/image";
import { Certificate, CertificatePage } from "@/interface/Certificate";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { ebcoApiData } from "@/utils/ebcoApiData";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchCertificateData = async (): Promise<CertificatePage | {}> => {
  try {
    // console.log("fetchCertificateData called");
    const response = await apiClient.get<CertificatePage>(
      `${API_ENDPOINT.GET.get_page}/${ebcoApiData.CERTIFICATE}?acf_format=standard`
    );
    // console.log(response);
    if (!response || !response.data) {
      throw new Error("No data found");
    }

    // console.log(response.data);

    return response.data;
  } catch (error) {
    // console.logerror("Failed to fetch new arrival data:", error);
    return {}; // Return an empty object if an error occurs
  }
};

const Certification = () => {
  const [certificate, setCertificate] = useState<Certificate[]>([]);
  const [bannerMedia, setBannerMedia] = useState<string>("");
  const [bannerText, setBannerText] = useState<string>("");
  const handleDownload = (url: string, imageName: string) => {
    // Create a virtual anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = imageName;
    link.target = "_blank";


    // Dispatch a click event to trigger the download
    link.click();
  };
  const sustainabilityQuery = useQuery({
    queryKey: ["certificate-page"],
    queryFn: fetchCertificateData,
  });

  const isWordPressPage = (data: any): data is CertificatePage => {
    return data && typeof data === "object" && "acf" in data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const aboutUsData = await sustainabilityQuery.refetch();

      if (aboutUsData && isWordPressPage(aboutUsData.data)) {
        setBannerText(aboutUsData.data.content.rendered);
        setBannerMedia(aboutUsData.data.acf.banner_image.url);
        // console.log("aboutUsData", aboutUsData.data);

        setCertificate(aboutUsData.data.acf.certificates);
      }
    };

    fetchData();
  }, []);
  return (
    <Box className="certification-container-wrapper" sx={{
      minHeight: "100vh"
    }}>
      <Box
        className="certification-text-container"
        dangerouslySetInnerHTML={{ __html: bannerText }}
      ></Box>
      <Box className="certification-container">
        <Box className="certification-box">
          <Box className="certi-gallery row-space-around">
            {certificate.map((item, index) => {
              return (
                <Box
                  className={`certification-image-box column-space-between ${!item.title ? "extra-certi" : ""
                    }`}
                  key={item.title + index}
                  sx={{
                    alignItems: "flex-start",
                    cursor: 'pointer'
                  }}
                  onClick={() => handleDownload(item.file, item.title)}

                >
                  <Image
                    src={item.image}
                    alt="certification"
                    width={200}
                    height={400}
                    className="certification-image"
                  />
                  {item.title && (
                    <Box
                      className="certification-text-box"
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Image
                        src={"/images/certification/icon.svg"}
                        alt="icon"
                        width={24}
                        height={24}
                        onClick={() => handleDownload(item.file, item.title)}
                      />
                      <Typography className="blue-text certification-text" onClick={() => handleDownload(item.file, item.title)}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Certification;
