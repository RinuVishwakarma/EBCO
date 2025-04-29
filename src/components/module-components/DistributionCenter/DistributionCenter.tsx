"use client";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { Box, Button, FormControlLabel, Switch, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import "./DistributionCenter.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  DiscoveryCenterIndia,
  DiscoveryCenterInternational,
  DistributorCenter,
} from "@/interface/discoveryCenterIndia";
import {
  discoveryCenterInternationalProp,
} from "@/interface/discoveryCenterInternational";
import Image from "next/image";
import IndiaMap from "@/components/utils-components/Map";
import { useDispatch } from "react-redux";
import { selectDiscovery } from "@/store/discovery";
import { selectDiscovery as selectNetwork } from "@/store/network";
import { useAppSelector } from "@/store/reduxHooks";
import { init } from "next/dist/compiled/webpack/webpack";
import WorldMap from "@/components/utils-components/WorldMap";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { ebcoApiData } from "@/utils/ebcoApiData";
import { apiClient } from "@/apiClient/apiService";
import { decodeHtml } from "@/utils/convertHtmltoArray";
import { useRouter, useSearchParams } from "next/navigation";
import { isIOSorSafari } from "@/utils/checkIOS";
import Link from "next/link";
const DistributionCenter = () => {

  const label = { inputProps: { 'aria-label': 'Size switch demo' } };
  const [selectedDiscoveryCenter, setSelectedDiscoveryCenter] = useState<
    "India" | "International" | ""
  >("");
  const [value, setValue] = useState("757,758");
  const [distributorData, setDistributorData] = useState<
    DistributorCenter[] | discoveryCenterInternationalProp[]
  >([]);
  const [selectedData, setSelectedData] = useState<
    DistributorCenter | discoveryCenterInternationalProp
  >();
  const [discoveryCenterData, setDiscoveryCenterData] = useState<
    DistributorCenter[] | discoveryCenterInternationalProp[]
  >([]);
  const [finalDiscoveryCenterData, setFinalDiscoveryCenterData] = useState<
    DistributorCenter[] | discoveryCenterInternationalProp[]
  >([]);
  const [discoveryCenterDataSorted, setDiscoveryCenterDataSorted] = useState<
    DistributorCenter[] | discoveryCenterInternationalProp[]
  >([]);
  const optionss = [
    // "Location",
    "Name : A to Z",
    "Name : Z to A",
    // "City : A to Z",
    // "City : Z to A",
  ];
  const [options, setOptions] = useState<string[]>(optionss);
  const [selectedOption, setSelectedOption] = useState<string>("Name : A to Z");
  const [queryOptionString, setQueryOptionString] = useState<string>(
    "&order=asc&orderby=title"
  );
  const dispatch = useDispatch();
  const discovery = useAppSelector(
    (state) => state.discovery
  )?.discoverySelected;
  const theme = useTheme();

  const selectedDiscoveryCenterOnMap = useAppSelector(
    (state) => state.discovery
  )?.discoverySelected;
  const network = useAppSelector((state) => state.network)?.discoverySelected

  const [selectedDiscovery, setSelectedDiscovery] = useState<
    DistributorCenter | discoveryCenterInternationalProp | null
  >(null);
  const query = useSearchParams();
  const [queryString, setQueryString] = useState<string>("757,758");
  const router = useRouter();
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const handleToggleLocation = () => {
    const newStatus = !isLocationEnabled;
    setIsLocationEnabled(newStatus);
    // Store the new status in localStorage
    //console.log("location", newStatus)
    localStorage.setItem("locationPermission", JSON.stringify(newStatus));

  };
  const getPermission = async () => {
    if (typeof window !== 'undefined') {

      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });
      //console.log(permissionStatus)
      if (permissionStatus.state === "granted") {
        if (!options.includes("Location")) {
          let newOptions = options;
          newOptions.push("Location");
          // let newSetLocations = new Set(newOptions);
          setOptions(newOptions);
        }
      }
    }
  }
  const checkLocation = async () => {
    if (typeof window !== 'undefined') {

      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "granted") {
          if (!options.includes("Location")) {
            let newOptions = options;
            newOptions.push("Location");
            // let newSetLocations = new Set(newOptions);
            setOptions(newOptions);
            setSelectedOption("Location");
            setQueryOptionString("&order=asc&orderby=title");
          }
        }
        permission.onchange = () => {
          if (permission.state === "granted") {
            localStorage.setItem("locationPermission", "true");
            //console.log(permission, "geolocation permission granteed")

            if (!options.includes("Location")) {

              setOptions([...options, "Location"]);
              setSelectedOption("Location");
              setQueryOptionString("&order=asc&orderby=title");

            }
          } else {
            //console.log(permission, "geolocation permission denied")
            localStorage.setItem("locationPermission", "false");

            setIsLocationEnabled(false);

            if (options.includes("Location")) {
              let newOptions = options;
              newOptions.splice(options.indexOf("Location"), 1);
              setOptions(newOptions);
              if (selectedOption === "Location") {
                setSelectedOption("Name : A to Z");
                setQueryOptionString("&order=asc&orderby=title");
                getDiscoveryCenterData();
              }
            }
          }
        };
      } catch (error) {
        console.error("Error checking location permission:", error);
      }
    }
  };
  useEffect(() => {
    if (selectedDiscoveryCenter === "India") {
      setDiscoveryCenterData([]);
      getDiscoveryCenterData();
    }

    return () => {
      setSelectedData({} as any);
    };

  }, [queryOptionString, selectedOption])

  useEffect(() => {
    if (typeof window !== 'undefined') {

      if (!isIOSorSafari() && typeof window !== 'undefined') {

        const storedStatus = localStorage.getItem("locationPermission");
        if (storedStatus === 'true') {

          setIsLocationEnabled(true)
        }
        if (isLocationEnabled) {

          getPermission()
          navigator.geolocation.getCurrentPosition((position) => {
            checkLocation();
          });
        } else {
          if (options.includes("Location")) {
            //console.log("Location")
            let newOptions = options;
            newOptions.splice(options.indexOf("Location"), 1);
            //console.log(newOptions)
            setOptions([...newOptions]);
            if (selectedOption === "Location") {
              setSelectedOption("Name : A to Z");
              setQueryOptionString("&order=asc&orderby=title");
              getDiscoveryCenterData();
            }

          }
        }
      }
    }
  }, [isLocationEnabled]);

  useEffect(() => {
    checkLocation();
    const type = query.get("type");
    if (type === "India") {
      // //console.log(type);
      setSelectedDiscoveryCenter("India");
      getDiscoveryCenterData();
    } else if (type === "International") {
      setSelectedDiscoveryCenter("International");
      getDiscoveryCenterIntData();
    } else {
      setSelectedDiscoveryCenter("India");
      getDiscoveryCenterData();
    }
  }, []);
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
      case "Location":
        queryString = "";
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
    setQueryOptionString(queryOptions[selected]);
  };
  useEffect(() => {
    // if (discoveryCenterData.length > 0 && selectedOption === "Location") {
    //console.log("discoveryCenterData", discoveryCenterData);
    // console.log("I AM ASKING PERMISSIONS")
    if (typeof window !== 'undefined') {
      if ("geolocation" in navigator && selectedOption === "Location") {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "granted") {
              navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                const calculateDistance = (
                  lat1: number,
                  lon1: number,
                  lat2: number,
                  lon2: number
                ) => {
                  const toRadians = (degree: number) => (degree * Math.PI) / 180;
                  const R = 6371; // Radius of the Earth in km
                  const dLat = toRadians(lat2 - lat1);
                  const dLon = toRadians(lon2 - lon1);
                  const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRadians(lat1)) *
                    Math.cos(toRadians(lat2)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
                  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  return R * c;
                };

                const sorted = discoveryCenterData
                  .map((location) => ({
                    ...location,
                    distance: calculateDistance(
                      latitude,
                      longitude,
                      location?.coordinates?.[1]!,
                      location?.coordinates?.[0]!
                    ),
                  }))
                  .sort((a, b) => a.distance - b.distance);
                //console.log(sorted, "-=-=--=data-=-=-==-=000000000000");
                setDiscoveryCenterDataSorted(sorted);
              });
            } else {
              // Permission is denied or prompt is not shown
              //console.log("Geolocation permission denied or not granted yet.");
              setDiscoveryCenterDataSorted(discoveryCenterData);
            }
          });
      } else if (discoveryCenterData.length > 0) {
        //console.log("discoveryCenterData", discoveryCenterData);
        setDiscoveryCenterDataSorted(discoveryCenterData);
      }
    }
  }, [discoveryCenterData]);
  const fetchDistributorNetworkIndia = async (): Promise<
    DistributorCenter[] | []
  > => {
    try {
      const response = await apiClient.get<DiscoveryCenterIndia[]>(
        `${API_ENDPOINT.GET.getDiscoveryCenter}?discovery-center-category=${queryString}&page=1&per_page=100${queryOptionString}`
      );

      if (!response || !response.data) {
        throw new Error("No data found");
      }

      // setProductRanges(acf.carousel);
      // setVideo(acf.banner_video);
      // setIsVideoLoading(false);

      return response.data.map((item) => ({
        id: item.id,
        place: item.title.rendered,
        dealer_name: item.acf.contact_person,
        address: item.acf.address,
        phone: item.acf.phone,
        email: item.acf.email,
        location: item.acf.city, // assuming 'city' is equivalent to 'location'
        zone: item.acf.zone,
        coordinates: [
          parseFloat(item.acf.longitude),
          parseFloat(item.acf.latitude),
        ],
        image: item.featured_media_src_url,
        contactPerson: item.acf.contact_person,
        google_maps_link: item.acf.google_maps_link
      }));
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return []; // Return an empty object if an error occurs
    }
  };
  const discoveryCenter = useQuery({
    queryKey: ["distribution-network-india"],
    queryFn: fetchDistributorNetworkIndia,
  });

  const getDiscoveryCenterData = async () => {
    const aboutUsData = await discoveryCenter.refetch();

    setDiscoveryCenterData(aboutUsData.data!);
  };
  useEffect(() => {
    if (selectedDiscoveryCenterOnMap) {
      //console.log(selectedDiscoveryCenterOnMap, "discoveryCenterData");
      setSelectedDiscovery(null);
      setSelectedDiscovery(selectedDiscoveryCenterOnMap);

      // Scroll the element into view smoothly
      let element = document.getElementById(selectedDiscoveryCenterOnMap.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // // Adjust the scroll position slightly down after scrolling into view
        // setTimeout(() => {
        //   window.scrollBy({
        //     top: 100,
        //     behavior: "smooth",
        //   });
        // }, 500); // Adjust delay if needed to ensure scrollIntoView is complete
      }
    }
  }, [selectedDiscoveryCenterOnMap]);

  //international
  const fetchDiscoveryCenterIntData = async (): Promise<
    discoveryCenterInternationalProp[] | []
  > => {
    try {
      const response = await apiClient.get<DiscoveryCenterInternational[]>(
        `${API_ENDPOINT.GET.getDiscoveryCenter}?discovery-center-category=760&page=1&per_page=100${queryOptionString}`
      );

      if (!response || !response.data) {
        throw new Error("No data found");
      }

      // setProductRanges(acf.carousel);
      // setVideo(acf.banner_video);
      // setIsVideoLoading(false);

      return response.data.map((item) => ({
        id: item.id,
        place: item.title.rendered,
        dealer_name: item.acf.contact_person,
        address: item.acf.address,
        phone: item.acf.phone,
        email: item.acf.email,
        location: item.acf.city, // assuming 'city' is equivalent to 'location'
        zone: item.acf.zone,
        coordinates: [
          parseFloat(item.acf.longitude),
          parseFloat(item.acf.latitude),
        ],
        image: item.featured_media_src_url,
        contactPerson: item.acf.contact_person,
        google_maps_link: item.acf.google_maps_link
      }));
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return []; // Return an empty object if an error occurs
    }
  };
  const distributionNetworkInternational = useQuery({
    queryKey: ["distribution-network-international"],
    queryFn: fetchDiscoveryCenterIntData,
  });

  useEffect(() => {
    //console.log(discoveryCenterDataSorted, "discoveryCenterDataSorted");
    if (discoveryCenterDataSorted.length > 0) {
      setFinalDiscoveryCenterData([]);
      setTimeout(() => {
        setFinalDiscoveryCenterData(discoveryCenterDataSorted);
      }, 100);
    }
  }, [discoveryCenterDataSorted]);

  const getDiscoveryCenterIntData = async () => {
    const distributionNetworkInternationalData =
      await distributionNetworkInternational.refetch();

    setDiscoveryCenterData(distributionNetworkInternationalData.data!);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    dispatch(selectDiscovery({} as any));
    setValue(newValue);
    setQueryString(newValue);
    setSelectedDiscovery(null);
  };
  useEffect(() => {
    if (selectedDiscoveryCenter === "India") {
      setDiscoveryCenterData([]);
      getDiscoveryCenterData();
    }

    return () => {
      setSelectedData({} as any);
    };

    ////console.log("changed", value, distributorData);
  }, [queryString, queryOptionString]);

  const handleViewLocation = (
    distributor: DistributorCenter | discoveryCenterInternationalProp
  ) => {
    if (!distributor.coordinates) return;

    let url = ""
    if (distributor.google_maps_link && distributor.google_maps_link.length !== 0) {
      url = distributor.google_maps_link
    } else {

      url = `https://www.google.com/maps?q=${distributor.coordinates[1]},${distributor.coordinates[0]}`;
    }
    window.open(url, "_blank");
  };
  return (

    <Box className="discoveryCenter-contaiener" sx={{
      minHeight: '100vh'
    }}>
      <Box className="discovery-center-banner row-center w-100">
        <Box
          className="discovery-center-image row-center bg-center"
          sx={{
            backgroundImage: `${selectedDiscoveryCenter === "India"
              ? `url('/images/discovery_center/bg.png')`
              : selectedDiscoveryCenter === "International"
                ? `url('/images/discovery-network-int.png')`
                : ""
              }`,
            width: "70%",
          }}
        ></Box>
        <Box
          className="discovery-center-tabsection column-center "
          sx={{
            background: customColors.skyBlueEbco,
          }}
        >
          <Box className="toggle-container-tab">
            <Box>
              <Typography
                sx={{
                  color: customColors.darkBlueEbco,
                  fontFamily: "Uniform Bold",
                  marginBottom: "0rem !important",
                }}
                className="discovery-center-title"
              >
                DISCOVERY CENTERS
              </Typography>
              <Typography
                sx={{
                  color: customColors.darkBlueEbco,
                  fontFamily: "Uniform Medium !important",
                  fontSize: "1.2rem !important",
                }}
                className="discovery-center-title"
              >
                Visit Experience Centers Near You
              </Typography>
              {!isIOSorSafari() && <FormControlLabel
                sx={{
                  marginBottom: "1rem",
                  fontSize: "1rem",
                  color: customColors.darkBlueEbco,
                  fontFamily: "Uniform Medium !important",
                }}
                className="location-switch-label"
                control={
                  <Switch {...label}
                    checked={isLocationEnabled}
                    onChange={handleToggleLocation}
                    disabled={isLocationEnabled}
                  />

                } label=" Find your nearest discovery center" />}
            </Box>
            <Box
              className="discovery-tab  row-space-around"
              sx={{
                width: "75%",
              }}
            >
              <span
                className={`tab-btn ${selectedDiscoveryCenter === "India" ? "active-tab" : ""
                  }`}
                onClick={() => {
                  setDiscoveryCenterData([]);
                  setSelectedDiscoveryCenter("India");
                  getDiscoveryCenterData();
                  setFinalDiscoveryCenterData([]);
                }}
              >
                India
              </span>
              <span
                className={`tab-btn ${selectedDiscoveryCenter === "International"
                  ? "active-tab"
                  : ""
                  }`}
                onClick={() => {
                  setDiscoveryCenterData([]);
                  setSelectedDiscoveryCenter("International");
                  getDiscoveryCenterIntData();
                  setFinalDiscoveryCenterData([]);
                }}
              >
                International
              </span>
            </Box>
          </Box>
        </Box>
      </Box>

      {selectedDiscoveryCenter === "India" && (
        <Box
          className="tabs"
          sx={{ width: "100%", padding: "1rem 0", overflow: "auto" }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            className="myProfile-scrollabletabs"
          >
            <Tab
              className="custom-discovery-center-tab"
              value="757,758"
              label="ALL CENTERS"
            />
            <Tab
              className="custom-discovery-center-tab"
              value="757"
              label="NATIONAL DISOVERY CENTER"
            />
            <Tab
              className="custom-discovery-center-tab"
              value="758"
              label="CITY DISCOVERY CENTERS"
            />
            <Tab
              className="custom-discovery-center-tab"
              value="759"
              label="LIVSMART ARENA"
            />
          </Tabs>
        </Box>
      )}

      <Box className="distributor-container" mt={4}>
        <Box className="row-space-between sort-filter-section w-25">
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
            className="custom-select-discovery"
            style={{
              padding: "0.5rem 1rem",
              borderColor: customColors.selectBox,
              fontSize: "16px ",
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
        <Box
          className="row-space-between"
          sx={{
            alignItems: "flex-start",
          }}
        >
          <Box
            className="distributor-wrapper column-space-between"
            sx={{
              backgroundColor: customColors.lightBlue,
            }}
          >
            <Box className="distributor-section w-100">
              {finalDiscoveryCenterData.map((distributor, index) => {
                return (
                  <div
                    id={distributor.id.toString()}
                    key={index + distributor.id}
                    className={`distributor-card row-space-between ${discovery?.id === distributor.id ? "active" : ""
                      }`}
                    style={{
                      backgroundColor:
                        discovery?.id === distributor.id
                          ? "red"
                          : "white",
                      margin: "1rem",
                      width: "95%",
                      alignItems: "stretch",
                      padding: "1rem",
                      cursor: "pointer",
                      boxShadow: "0px 4px 30px 0px #00000059",
                    }}
                    onClick={() => {
                      dispatch(selectDiscovery(distributor as any));
                      setSelectedDiscovery(distributor);

                      dispatch(selectNetwork(distributor as any));


                      // router.push(`/discovery-centers/${distributor.id}`);
                    }}
                  >
                    {distributor?.image && (
                      <Box className="distributor-image column-center"
                        onClick={() => {
                          dispatch(selectDiscovery(distributor as any));
                          setSelectedDiscovery(distributor);
                        }}
                      >
                        <Link  prefetch={false}
                          href={`/discovery-centers/${distributor.id}`}
                          passHref
                          className="w-100 h-100"
                          rel="noopener noreferrer"
                        >

                          <Image
                            src={distributor?.image}
                            alt="Discovery center"
                            width={300}
                            height={300}
                            className="discovery_center_image"
                          />
                        </Link>
                      </Box>
                    )}
                    <Box className="discovery-content">
                      <Box>
                        <Typography
                          className="title single-line"
                          sx={{
                            color: customColors.darkBlueEbco,
                          }}
                        >
                          {decodeHtml(distributor.place)}
                        </Typography>
                        <Typography className="contact-person">
                          {distributor.contactPerson}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          className="address"
                          sx={{
                            color: customColors.lightGreyEbco,
                          }}
                        >
                          {distributor.address}
                        </Typography>
                      </Box>
                      <Box
                        className="contact column-center"
                        sx={{
                          marginTop: "0.5rem",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          className="row-center contact-detail"
                          sx={{
                            alignItems: "flex-start",
                            margin: "0.5rem 0",
                            userSelect:"text"
                          }}
                          onClick={() => window.open(`tel:${distributor.phone?.toString().split('/')[0]}`)}

                        >
                          <Image
                            src="/images/call.svg"
                            alt="call"
                            width={16}
                            height={16}
                            className="discovery_center_icon"
                          />
                          <Typography
                            sx={{
                              marginLeft: "1rem",
                              color: customColors.darkBlueEbco,
                            }}
                            className="contact-text single-line"
                          >
                            {distributor.phone}
                          </Typography>
                        </Box>
                        <Box
                          className="row-center contact-detail"
                          sx={{
                            alignItems: "flex-start",
                            userSelect:"text"
                          }}
                          onClick={() => window.open(`mailto:${distributor.email?.split('/')[0]}`)}

                        >
                          <Image
                            src="/images/email.svg"
                            alt="call"
                            width={16}
                            height={16}
                            className="discovery_center_icon"
                          />
                          <Typography
                            sx={{
                              marginLeft: "1rem",
                              color: customColors.darkBlueEbco,
                            }}
                            className="contact-text single-line"

                          >
                            {distributor.email}
                          </Typography>
                        </Box>
                        <Box
                          className="row-center contact-detail"
                          sx={{
                            alignItems: "flex-start",
                            margin: "0.5rem 0",
                          }}
                          onClick={() => {
                            handleViewLocation(distributor);
                          }}
                        >
                          <Image
                            src="/images/location.svg"
                            alt="call"
                            width={16}
                            height={16}
                            className="discovery_center_icon "
                          />
                          <Typography
                            sx={{
                              marginLeft: "1rem",
                              textDecoration: "underline",
                              color: customColors.darkBlueEbco,
                            }}
                            className="contact-text single-line"
                          >
                            View location
                          </Typography>
                        </Box>
                      </Box>
                      {/* <Button className="know-more action-button"
                        onClick={() => {

                          router.push(`/discovery-centers/${distributor.id}`);
                        }}
                      >Know more</Button> */}
                    </Box>
                  </div>
                );
              })}
            </Box>
          </Box>
          <Box
            className="map"
            sx={{
              flex: "1",
            }}
          >
            {selectedDiscoveryCenter === "India" ? (
              <IndiaMap
                data={finalDiscoveryCenterData}
              />
            ) : (
              <WorldMap data={finalDiscoveryCenterData} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DistributionCenter;
