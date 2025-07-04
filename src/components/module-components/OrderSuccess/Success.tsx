"use client";
import {API_ENDPOINT} from "@/apiClient/apiEndpoint";
import {apiClient} from "@/apiClient/apiService";
import "@/components/module-components/Checkout/Checkout.css";
import {Faq} from "@/interface/FAQ";
import {LineItem,MetaData,Order} from "@/interface/Order";
import {processOrder} from "@/store/cart";
import {useAppDispatch} from "@/store/reduxHooks";
import {customColors} from "@/styles/MuiThemeRegistry/theme";
import {decodeHtml} from "@/utils/convertHtmltoArray";
import formatPrice from "@/utils/formatPrice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from "@mui/material";
import {useMutation,useQuery} from "@tanstack/react-query";
import Image from "next/image";
import {useRouter,useSearchParams} from "next/navigation";
import {useEffect,useState} from "react";

const Success = () => {
  const [paymentData, setPaymentData] = useState(null);
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [orders, setOrders] = useState<Order | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const router = useRouter();

  const dispatch = useAppDispatch();

  const accordians = [
    {
      id: "panel1",
      title: "Accordion Item #1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    },
    {
      id: "panel2",
      title: "Accordion Item #2",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    },
    {
      id: "panel3",
      title: "Accordion Item #3",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    },
  ];
  const [dataParam, setDataParam] = useState<string | null>(null);
  const fetchOrderData = async (
    id: number | string
  ): Promise<Order | undefined> => {
    //console.log(" called", id);
    if (id === undefined) return undefined;
    try {
      const response = await apiClient.get<Order | null>(
        `${API_ENDPOINT.GET.getOrders}/${id}`
      );

      if (!response || !response.data) {
        throw new Error("No data found");
      }

      //console.log(response.data, "-=-=-=-=-=-=");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch new arrival data:", error);
      return undefined;
    }
  };
  interface orderStatus {
    status: string;
  }
  const sendStatus = async (id: number) => {
    // return;
    try {
      const response = await apiClient.post<orderStatus, any>(
        `${API_ENDPOINT.POST.orders}/${id}`,
        {
          status: "completed",
        },
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response;
    } catch { }
  };
  const mutation = useMutation({
    mutationFn: sendStatus,
    onSuccess: (data) => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      // return;
      //console.log(data, "--=-=-=-=---=-=-=-=-=-========");
    },
    onError: (error) => {
      // Handle error, e.g., show an error message to the user
      console.error("Error fetching token:", error);
    },
  });
  const fetchFaq = async (): Promise<Faq[]> => {
    try {
      const response = await apiClient.get<Faq[]>(
        ` ${API_ENDPOINT.GET.handleFAQ}?per_page=100&order=asc&orderBy=id`
      );
      // //console.log(response, "new arrival data");
      if (!response) {
        throw new Error("No data found");
      }
      // setTotalPages(response.headers["x-wp-totalpages"]);
      // setWishlistProducts(response.data);
      setFaqs(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch new arrival data", error);
      return []; // Return an empty array if an error occurs
    }
  };

  const faqQuery = useQuery({
    queryKey: ["faq-listing"],
    queryFn: fetchFaq,
  });

  useEffect(() => {
    faqQuery.refetch();
    dispatch(processOrder(null));
  }, []);
  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      const decodedData = decodeURIComponent(dataParam);
      setPaymentData(JSON.parse(decodedData));
      setDataParam(decodedData); // Set the dataParam state
      //console.log("paymentData", JSON.parse(decodedData));
      // mutation.mutate(JSON.parse(decodedData));
    }
  }, [searchParams]);

  const fetchCareersData = useQuery({
    queryKey: ["careerDataQuery", dataParam], // Add dataParam to the queryKey to refetch when it changes
    queryFn: () => {
      if (dataParam) {
        return fetchOrderData(dataParam);
      }
      return Promise.reject("No dataParam available");
    },
    enabled: !!dataParam, // Ensure the query only runs when dataParam is available
  });
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div
      style={{
        padding: "2rem 3rem",
      }}
      className="order-page"
    >
      <Typography className="checkout-text-check">
        ORDER &nbsp;
        <Typography className="checkout-text-out">PLACED</Typography>
      </Typography>

      <Box className="checkout-container w-100">
        <Box
          className="column-space-between w-100 checkout-billing"
          sx={{
            alignItems: "flex-start",
          }}
        >
          <Box className="checkout-cart">
            {orders?.line_items?.map((product: LineItem) => (
              <Box
                key={orders?.id}
                className="product-item row-space-between"
                sx={{
                  alignItems: "flex-start",
                }}
              >
                <Image
                  src={product.image.src}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="product-image-checkout"
                />
                <Box
                  className="product-info"
                  flex={1}
                  sx={{
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    className="product-name-action row-space-between"
                    sx={{ alignItems: "flex-start" }}
                  >
                    <Typography className="product-name-checkout">
                      {product.name}
                    </Typography>
                  </Box>
                  <Box className="custom-divider"></Box>
                  <Box className="options-container w-100">
                    {product.meta_data.map(
                      (data: MetaData) =>
                        data.key !== "_reduced_stock" && (
                          <Box
                            className="option-item-checkout row-space-between w-100"
                            key={data.id}
                          >
                            <Typography className="option-key-checkout">
                              {data.key}
                            </Typography>
                            <Typography className="option-value-checkout">
                              : {data.value}
                            </Typography>
                          </Box>
                        )
                    )}
                    <Box className="option-item-checkout row-space-between w-100">
                      <Typography className="option-key-checkout">
                        Quantity
                      </Typography>
                      <Typography className="option-value-checkout">
                        : {product.quantity}
                      </Typography>
                    </Box>
                    <Box className="option-item-checkout row-space-between w-100">
                      <Typography className="option-key-checkout">
                        Price
                      </Typography>
                      <Typography className="option-value-checkout">
                        : {formatPrice(product.price)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          <Box className="custom-divider"></Box>
          <Box className="total-checkout-container row-space-between w-100">
            <Typography className="total-checkout-text ">TOTAL BILL</Typography>
            <Typography className="total-checkout-price">
              {formatPrice(orders?.total!)}
            </Typography>
          </Box>
          <Box className="order-info-bill row-space-between">
            <Box className="column-center">
              <Typography>Order Number : {orders?.id}</Typography>
            </Box>
          </Box>
        </Box>
        <Box className="checkout-summary column-space-between">
          <Typography
            className="summary-text payment-successful-text"
            sx={{
              textAlign: "center",
              color: customColors.orangeEbco,
            }}
          >
            ORDER PLACED
          </Typography>
          <img
            src="/gifs/payment.gif"
            alt=""
            style={{
              width: "150px",
            }}
          />
          <Typography
            sx={{
              textAlign: "center",
              color: "#333",
              margin: "10px 0",
              fontSize: "14px",
            }}
          >
            Our team will contact you for the delivery
          </Typography>
          <Box
            className="cart-summary-container w-100"
            sx={{
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
            }}
            onClick={() => {
              router.push("/my-profile?tab=orders");
            }}
          >
            <button
              className="orange-button w-100"
              style={{
                margin: "0 !important",
                justifySelf: "flex-end",
                height: "fit-content",
              }}
            >
              OKAY
            </button>
          </Box>
        </Box>
      </Box>

      <Box className="faq-bumrah-banner-container w-100 row-space-between">
        <Box className="faq-container">
          <Box className="faq-container-header ">
            <Typography className="faq-text">
              FREQUENTLY ASKED{" "}
              <Typography className="faq-text-bold">QUESTIONS</Typography>
            </Typography>
          </Box>
          <Box className="faq">
            {faqs.map((accordion) => (
              <Accordion
                key={accordion.id}
                expanded={expanded === accordion.id.toString()}
                className="accordion-custom"
                onChange={handleChange(accordion.id.toString())}
                sx={{
                  boxShadow:
                    expanded === accordion.id.toString()
                      ? "0 1px 10px #ddd !important;"
                      : "none",
                }}
              >
                <AccordionSummary
                  aria-controls={`${accordion.id}-content`}
                  id={`${accordion.id}-header`}
                  expandIcon={
                    expanded === accordion.id.toString() ? (
                      <RemoveIcon
                        sx={{
                          color: "#092853",
                        }}
                      />
                    ) : (
                      <AddIcon
                        sx={{
                          color: "#092853",
                        }}
                      />
                    )
                  }
                >
                  <Typography className="accordion-text">
                    {decodeHtml(accordion.title.rendered)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="accordion-details">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: accordion.content.rendered,
                      }}
                    ></div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Success;