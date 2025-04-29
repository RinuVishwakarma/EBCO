"use client";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { Box, FormControlLabel, Switch, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import "./DistributionNetwork.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import {
  DistributorNetwork,
} from "@/interface/distributorNetworkIndia";
import {
  DistributorNetworkInt,
} from "@/interface/distributorNetworkInternational";
import Image from "next/image";
import IndiaMap from "@/components/utils-components/Map";
import { selectDiscovery } from "@/store/discovery";
import { selectDiscovery as selectNetwork } from "@/store/network";
import WorldMap from "@/components/utils-components/WorldMap";
import { DistributorCenter } from "@/interface/discoveryCenterIndia";
import { discoveryCenterInternationalProp } from "@/interface/discoveryCenterInternational";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/reduxHooks";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { ebcoApiData } from "@/utils/ebcoApiData";
import { useQuery } from "@tanstack/react-query";
import {
  DistributorNetworkIndia,
  DistributorNetworkInternational,
} from "@/interface/distributorNetwork";
import { decodeHtml } from "@/utils/convertHtmltoArray";
import { isIOSorSafari } from "@/utils/checkIOS";
const DistributionNetwork = () => {
  const label = { inputProps: { 'aria-label': 'Size switch demo' } };

  const [selectedDiscoveryCenter, setSelectedDiscoveryCenter] = useState<
    "India" | "International"
  >("India");
  const [selectedDiscovery, setSelectedDiscovery] = useState<
    DistributorNetwork | DistributorNetworkInt | null
  >(null);
  const [value, setValue] = useState("ALL");
  const [distributorData, setDistributorData] = useState<
    DistributorNetwork[] | DistributorNetworkInt[]
  >([]);
  const [distributorNetworkData, setDistributorNetworkData] = useState<
    DistributorNetwork[] | DistributorNetworkInt[]
  >([]);
  const [finalDistributionNetwork, setFinalDistributionNetwork] = useState<
    DistributorNetwork[] | DistributorNetworkInt[]
  >([]);
  const [DistributionNetworkSorted, setDistributionNetworkSorted] = useState<
    DistributorNetwork[] | DistributorNetworkInt[]
  >([]);
  const selectedDiscoveryCenterOnMap = useAppSelector(
    (state) => state.discovery
  )?.discoverySelected;
  const [
    distributorNetworkInternationalData,
    setDistributorNetworkInternationalData,
  ] = useState<DistributorNetwork[] | DistributorNetworkInt[]>([]);
  const [selectedData, setSelectedData] = useState<
    DistributorCenter | discoveryCenterInternationalProp
  >();
  const optionss = ["Name : A to Z", "Name : Z to A"];
  const [stateOptions, setStateOptions] = useState<string[]>(['ALL', 'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odhisa', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal']
  )
  const [selectedStateOption, setSelectedStateOption] = useState<string>('ALL')
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [options, setOptions] = useState(optionss);
  const [selectedOption, setSelectedOption] = useState<string>("Name : A to Z");
  const [queryOptionString, setQueryOptionString] = useState<string>(
    "&order=asc&orderby=title"
  );
  const theme = useTheme();
  const discovery = useAppSelector(
    (state) => state.discovery
  )?.discoverySelected;

  const network = useAppSelector((state) => state.network)?.discoverySelected

  const dispatch = useDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const fetchDistributorNetworkIndia = async (): Promise<
    DistributorNetwork[] | []
  > => {
    try {
      const response = await apiClient.get<DistributorNetworkIndia[]>(
        `${API_ENDPOINT.GET.getDistributorNetwork}?distributor-network-category=${ebcoApiData.DISTRIBUTION_NETWORK_INDIA}&page=1&per_page=100${queryOptionString}`
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
        google_maps_link: item.acf.google_maps_link,
        state: item.acf.state
      }));
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return []; // Return an empty object if an error occurs
    }
  };
  const distributionNetworkIndia = useQuery({
    queryKey: ["distribution-network-india"],
    queryFn: fetchDistributorNetworkIndia,
  });
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
          setSelectedOption("Location");
          setQueryOptionString("&order=asc&orderby=title");
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
                getDistributorNetworkData();
              }
            }
          }
        };
      } catch (error) {
        //console.error("Error checking location permission:", error);
      }
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {

      if (!isIOSorSafari()) {

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
              getDistributorNetworkData();
            }

          }
        }
      }
    }
  }, [isLocationEnabled]);
  useEffect(() => {
    // if (discoveryCenterData.length > 0 && selectedOption === "Location") {
    ////console.log("discoveryCenterData", discoveryCenterData);
    //console.log("I AM ASKING PERMISSIONS")
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

                const sorted = distributorData
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
                ////console.log(sorted, "-=-=--=data-=-=-==-=000000000000");
                setDistributionNetworkSorted(sorted);
              });
            } else {
              // Permission is denied or prompt is not shown
              ////console.log("Geolocation permission denied or not granted yet.");
              setDistributionNetworkSorted(distributorData);
            }
          });
      } else if (distributorData.length > 0) {
        ////console.log("discoveryCenterData", discoveryCenterData);
        setDistributionNetworkSorted(distributorData);
      }
    }
  }, [distributorData]);
  useEffect(() => {
    if (typeof window !== 'undefined') {

      const checkLocation = async () => {
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
        } catch (error) {
          //console.error("Error checking location permission:", error);
        }
      };
      if (typeof window !== 'undefined') {
        checkLocation();
      }
      ////console.log("DEFAULT", distributorNetworkData);
      //console.log("I AM ASKING PERMISSIONS")
      if (typeof window !== 'undefined') {

        if ("geolocation" in navigator && selectedOption === "Location") {
          navigator.permissions
            .query({ name: "geolocation" })
            .then((permissionStatus) => {
              if (permissionStatus.state === "granted") {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords;

                  const calculateDistance = (
                    lat1: any,
                    lon1: any,
                    lat2: any,
                    lon2: any
                  ) => {
                    const toRadians = (degree: any) => (degree * Math.PI) / 180;
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

                  const sorted = distributorNetworkData
                    .map((location) => ({
                      ...location,
                      distance: calculateDistance(
                        latitude,
                        longitude,
                        location?.coordinates?.[1],
                        location?.coordinates?.[0]
                      ),
                    }))
                    .sort((a, b) => a.distance - b.distance);
                  //console.log(sorted, "-=-=--=data-=-=-==-=000000000000");
                  // return;
                  setDistributionNetworkSorted(sorted);
                });
              } else {
                // Permission is denied or prompt is not shown
                //console.log("Geolocation permission denied or not granted yet.");
                setDistributionNetworkSorted(distributorNetworkData);
              }
            });
        } else if (
          distributorNetworkData.length > 0 &&
          selectedOption !== "Location"
        ) {
          setDistributionNetworkSorted(distributorNetworkData);
        }
      }
    }
  }, [distributorNetworkData]);

  const handleToggleLocation = () => {
    const newStatus = !isLocationEnabled;
    setIsLocationEnabled(newStatus);
    // Store the new status in localStorage
    //console.log("location", newStatus)
    localStorage.setItem("locationPermission", JSON.stringify(newStatus));

  };
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

  useEffect(() => {
    //console.log(DistributionNetworkSorted, "DistributionNetworkSorted");
    if (DistributionNetworkSorted.length > 0) {
      setFinalDistributionNetwork([]);
      setTimeout(() => {
        setFinalDistributionNetwork(DistributionNetworkSorted);
        changeStateWiseData()
      }, 100);
    }
  }, [DistributionNetworkSorted]);


  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement> | any
  ) => {
    const selected = event.target.value;
    setSelectedOption(selected);
    setQueryOptionString(queryOptions[selected]);
  };

  const handleSortStateChange = (
    event: React.ChangeEvent<HTMLSelectElement> | any
  ) => {
    const selected = event.target.value;
    setSelectedStateOption(selected);
  };

  useEffect(() => {
    changeStateWiseData()
  }, [selectedStateOption])

  const changeStateWiseData = () => {
    // console.log("I AM HERE", selectedStateOption, DistributionNetworkSorted)
    if (selectedStateOption !== "ALL") {
      setFinalDistributionNetwork(DistributionNetworkSorted.filter(network => {
        return network.state?.trim().toLowerCase() === selectedStateOption.trim().toLowerCase()
      }))
    } else {
      setFinalDistributionNetwork(
        DistributionNetworkSorted.filter((network) => {
          return stateOptions
            .map(option => option.toLowerCase())
            .includes(network.state!.trim().toLowerCase());
        })
      );
    }


  }
  const getDistributorNetworkData = async () => {
    const aboutUsData = await distributionNetworkIndia.refetch();

    setDistributorNetworkData(aboutUsData.data!);
  };

  //international
  const fetchDistributorNetworkInternational = async (): Promise<
    DistributorNetwork[] | []
  > => {
    try {
      const response = await apiClient.get<DistributorNetworkInternational[]>(
        `${API_ENDPOINT.GET.getDistributorNetwork}?distributor-network-category=${ebcoApiData.DISTRIBUTION_NETWORK_INTERNATIONAL}&page=1&per_page=100${queryOptionString}`
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
        google_maps_link: item.acf.google_maps_link
      }));
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return []; // Return an empty object if an error occurs
    }
  };
  const distributionNetworkInternational = useQuery({
    queryKey: ["distribution-network-international"],
    queryFn: fetchDistributorNetworkInternational,
  });

  const getDistributorNetworkInternationalData = async () => {
    const distributionNetworkInternationalData =
      await distributionNetworkInternational.refetch();

    setDistributorNetworkData(distributionNetworkInternationalData.data!);
  };
  const sortDataByTitle = (
    data: DistributorNetwork[] | DistributorNetworkInt[],
    order = "asc"
  ) => {
    const sortedData = [...data].sort((a, b) => {
      const titleA = a.place.toLowerCase();
      const titleB = b.place.toLowerCase();

      if (order === "asc") {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });

    setDistributorNetworkData(sortedData);
  };

  useEffect(() => {
    if (selectedOption === "Name : A to Z") {
      sortDataByTitle(distributorNetworkData, "asc");
    } else if (selectedOption === "Name : Z to A") {
      sortDataByTitle(distributorNetworkData, "desc");
    }
  }, [selectedOption]);

  useEffect(() => {
    getDistributorNetworkData();
  }, [queryOptionString, selectedOption]);
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
  useEffect(() => {
    if (selectedDiscoveryCenter === "India") {
      if (value === "ALL") {
        getDistributorNetworkData();
      } else {
        setDistributorNetworkData(
          distributionNetworkIndia.data?.filter(
            (item) => item.zone?.toLowerCase() === value.toLowerCase()
          )!
        );
      }
    }
    ////console.log("changed", value);
    return () => {
      dispatch(selectDiscovery({} as any));
      // dispatch(selectNetwork({} as any));
    };
  }, [value, selectedDiscoveryCenter]);

  useEffect(() => {
    if (selectedDiscoveryCenterOnMap) {
      //console.log(selectedDiscoveryCenterOnMap, "discoveryCenterData");
      setSelectedDiscovery(null);
      setSelectedDiscovery(selectedDiscoveryCenterOnMap);

      // Scroll the element into view smoothly
      let element = document.getElementById(selectedDiscoveryCenterOnMap.id);
      //console.log(element, "element");
      if (element) {
        //console.log(element, "element");
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
  return (
    <Box>
      <Box className="discovery-center-banner row-center w-100">
        <Box
          className="discovery-center-image row-center bg-center"
          sx={{
            height: "60vh",
            backgroundImage: `url('/images/discovery-network.png')`,
            width: "70%",
          }}
        ></Box>
        <Box
          className="discovery-center-tabsection column-center "
          sx={{
            background: customColors.skyBlueEbco,
            height: "60vh",
          }}
        >
          <Box className="toggle-container-tab">
            <Box>
              <Typography
                sx={{
                  color: customColors.darkBlueEbco,
                  fontFamily: "Uniform Bold",
                }}
                className="discovery-center-title"
              >
                DISTRIBUTION NETWORK
              </Typography>
            </Box>
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

              } label=" Find your nearest distribution network" />}
            <Box className="discovery-tab  row-space-around">
              <span
                className={`tab-btn ${selectedDiscoveryCenter === "India" ? "active-tab" : ""
                  }`}
                onClick={() => {
                  setDistributorNetworkData([]);
                  setFinalDistributionNetwork([]);
                  setSelectedDiscoveryCenter("India");
                  getDistributorNetworkData();
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
                  setDistributorNetworkData([]);
                  setFinalDistributionNetwork([]);
                  setSelectedDiscoveryCenter("International");
                  getDistributorNetworkInternationalData();
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
              className="custom-discovery-tab"
              value="ALL"
              label="ALL DISTRIBUTORS"
            />
            <Tab className="custom-discovery-tab" value="EAST" label="EAST" />
            <Tab className="custom-discovery-tab" value="WEST" label="WEST" />
            <Tab className="custom-discovery-tab" value="NORTH" label="NORTH" />
            <Tab className="custom-discovery-tab" value="SOUTH" label="SOUTH" />
          </Tabs>
        </Box>
      )}
      <Box className="distributor-container" mt={4}>
        <Box className="row-space-between sort-filter-section w-100" sx={{
          justifyContent: 'flex-start'
        }}>
          <Box>

            <Typography
              sx={{
                width: "100%",
                marginRight: "10px",
                color: "#8D8D8D",
              }}
            >
              Sort by:
            </Typography>
          </Box>
          <select
            id="sort-by-select"
            className="custom-select-discovery w-25"
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
          <select
            id="sort-by-select"
            className="custom-select-discovery state-select w-25"
            style={{
              padding: "0.5rem 1rem",
              borderColor: customColors.selectBox,
              fontSize: "16px ",
              fontFamily: "Uniform Medium",
              color: customColors.darkBlueEbco,
              borderRadius: "100px",
            }}
            value={selectedStateOption}
            onChange={handleSortStateChange}
          >
            {stateOptions.map((option) => (
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
            {<Box className="distributor-section">
              {finalDistributionNetwork.map(
                (distributor: DistributorNetwork, index) => {
                  return (
                    <div
                      id={`${distributor.id.toString()}`}
                      key={index}
                      className={`distributor-card-network column-space-between ${discovery.id === distributor.id ? "active" : ""
                        }`}
                      style={{
                        backgroundColor: "white",
                        margin: "1rem",
                        width: "85%",
                        alignItems: "flex-start",
                        padding: "1rem",
                        boxShadow: "0px 4px 30px 0px #00000059",
                        flexDirection: 'column'
                      }}
                      onClick={() => {
                        dispatch(selectDiscovery(distributor as any))
                        dispatch(selectNetwork(distributor as any));

                      }

                      }
                    >
                      <Box>
                        <Typography className="title single-line">
                          {decodeHtml(distributor.place)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography className="dealer">
                          {distributor.dealer_name}
                        </Typography>
                        <Typography className="address ">
                          {decodeHtml(distributor.address)}
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
                            width={20}
                            height={20}
                            className="discovery_center_icon"
                          />
                          <Typography
                            sx={{ marginLeft: "1rem" }}
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
                            width={20}
                            height={20}
                            className="discovery_center_icon"
                          />
                          <Typography
                            className="contact-text single-line"
                            sx={{ marginLeft: "1rem" }}
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
                          onClick={() => handleViewLocation(distributor)}
                        >
                          <Image
                            src="/images/location.svg"
                            alt="call"
                            width={20}
                            height={20}
                            className="discovery_center_icon"
                          />
                          <Typography
                            className="contact-text single-line"
                            sx={{
                              marginLeft: "1rem",
                              textDecoration: "underline",
                            }}
                          >
                            View location
                          </Typography>
                        </Box>
                      </Box>
                    </div>
                  );
                }
              )}
            </Box>}
          </Box>
          <Box
            className="map"
            sx={{
              flex: "1",
            }}
          >
            {selectedDiscoveryCenter === "India" ? (
              <IndiaMap
                data={finalDistributionNetwork}
              />
            ) : (
              <WorldMap data={finalDistributionNetwork} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DistributionNetwork;
