import React, { useState, useEffect } from "react";
import { Box, Typography, Pagination, PaginationItem } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
// import ProductDetailsModal from "@/components/ProductDetailsModal";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/store/reduxHooks";
import formatPrice from "@/utils/formatPrice";
import { Order } from "@/interface/Order";
import ProductDetailsModal from "./productsDialog";
import './Order.css'

const Orders = () => {
  const auth = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const orderQuery = useQuery({
    queryKey: ["shop-now"],
    queryFn: () => fetchOrders(auth.id!),
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const fetchOrders = async (id: string | number): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>(
        `${API_ENDPOINT.GET.getOrders}?customer=${id}&page=${page}&per_page=10`
      );
      if (!response) {
        throw new Error("No data found");
      }
      setTotalPages(response.headers["x-wp-totalpages"]);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch orders", error);
      return []; // Return an empty array if an error occurs
    }
  };

  useEffect(() => {
    orderQuery.refetch();
  }, [page]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleShowDetails = (order: Order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  function getOrderDate(order: Order): string {
    const customDateMeta = order.meta_data.find(meta => meta.key === 'custom_date_created');
    return customDateMeta ? customDateMeta.value : order.date_created;
  }

  return (
    <Box className="column-space-around">
      <Box className="order-wrapper">
        {orderQuery?.data &&
          orderQuery?.data!.map((order) =>
            <Box className="order-container" key={order.id}>
              <Box className="order-description">
                <Box className="title-action row-space-between">
                  <Box className="title-subtitle row-space-between w-100" sx={{
                    flexDirection: 'row !important'
                  }}>
                    <Typography className="order-title blue-text single-line">
                      Order ID: #{order.id}
                    </Typography>
                    <Box className="order-id-details row-center">
                      <Typography className="order-date">
                        Order Date: {formatDate(getOrderDate(order))}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="order-divider"></Box>

                <Box className="order-item-details">
                  {order?.line_items && order?.line_items?.length > 0 && <Box className="order-item-header row-space-between" sx={{
                    display: 'flex',

                    paddingBottom: '10px',
                  }}>
                    <Typography className="order-item-name">{order.line_items[0].name}</Typography>
                    {order.line_items.length === 1 && <Typography className="order-item-quantity">Quantity: {order.line_items[0].quantity}</Typography>
                    }

                  </Box>}
                  {order?.line_items?.length > 1 && <Typography
                    className="order-item-count"
                    onClick={() => handleShowDetails(order)}
                    style={{
                      textDecoration: 'underline',
                      fontFamily: "Uniform Medium !important",
                      cursor: 'pointer',
                      color: '#092853',
                      paddingBottom: '1.5rem !important',
                      borderBottom: '1px solid #f5f5f5',
                    }}
                  >
                    + {order?.line_items?.length - 1} More
                  </Typography>}
                </Box>
                <Box className="order-action-details">
                  <Typography
                    className={` order-status order-status-${order.status}`}
                  >
                    {order.status}
                  </Typography>
                </Box>
                <Typography className="order-title blue-text single-line" sx={{
                  fontSize: '28px !important !important',
                  textAlign: 'end'
                }}>
                  Total: {formatPrice(order.total)}
                </Typography>
              </Box>
            </Box>
          )}
      </Box>
      {orderQuery?.data && orderQuery?.data!.length > 0 && (
        <Box
          className="row-center"
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
      )}
      {selectedOrder && (
        <ProductDetailsModal
          open={openModal}
          onClose={handleCloseModal}
          order={selectedOrder}
        />
      )}
    </Box>
  );
};

export default Orders;
