"use client";
import { useAppSelector, useAppDispatch } from "@/store/reduxHooks";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import "./cart.css";
import "@/styles/productDetails.css";
import Image from "next/image";
import { setCartDrawerOpen } from "@/store/cartDrawer";
import { ProductDetails } from "@/interface/productDetails";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {
  selectCart,
  emptyCart,
  addProductToCheckout,
  clearCheckout,
  setCheckoutSource,
  toggleProductOptions,
} from "@/store/cart";
import formatPrice from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import { addProductcheckout } from "@/store/checkout";
import CloseIcon from "@mui/icons-material/Close";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { decodeHtml } from "@/utils/convertHtmltoArray";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { apiClient } from "@/apiClient/apiService";
import { CartItemApi, Cart as CartProduct, CartResponse } from "@/interface/Cart";
import { useMutation, useQuery } from "@tanstack/react-query";
import { setCartProductsCount } from "@/store/cartCount";


const Cart = () => {
  const products = useAppSelector((state) => state.cart.products);
  const [isQuantityUpdating, setIsQuantityUpdating] = useState(false)
  const dispatch = useAppDispatch();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const router = useRouter();
  const cart = useAppSelector(selectCart);
  const [cartProducts, setCartProducts] = useState<CartProduct>()
  const [cartItems, setCartItems] = useState<CartItemApi[] | []>([])
  useEffect(() => {
    const fetch = async () => {

      let data = await getCart.refetch()
      setCartProducts(data?.data!)
      setCartItems(data?.data?.items!)
    }
    fetch()
  }, []);
  interface ProductPayload {
    cart_item_key: string
  }
  const refetch = async () => {

    let data = await getReCart.refetch()
    dispatch(setCartProductsCount(data.data?.items.length!))

  }

  const DeleteFromCart = async (product: CartItemApi) => {



    try {
      const response = await apiClient.post<ProductPayload, CartResponse>(
        `${API_ENDPOINT.POST.removeCart}`, {
        cart_item_key: product.cart_item_key
      });
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response;
    } catch { }
  };
  const mutationDeletFromCart = useMutation({
    mutationFn: DeleteFromCart,
    onSuccess: async (data) => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove("loading");
      refetch()

    },
    onError: (error) => {
      // Handle error, e.g., show an error message to the user
      console.error("Error fetching token:", error);
    },
  });

  const ClearCart = async () => {



    try {
      const response = await apiClient.get<CartResponse>(
        `${API_ENDPOINT.GET.clearCart}`);
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response;
    } catch { }
  };
  const mutationClearFromCart = useMutation({
    mutationFn: ClearCart,
    onSuccess: async (data) => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove("loading");
      setCartItems([])
      refetch()
      // setCartProducts(data?.data.cart.data)

    },
    onError: (error) => {
      // Handle error, e.g., show an error message to the user
      console.error("Error fetching token:", error);
    },
  });


  const calculateTotalPrice = (products: CartItemApi[]): string => {
    const totalPrice = products.reduce((total, product) => {
      const price = product.sale_price ? product.sale_price : product.price;
      return total + Number(price) * Number(product.quantity);
    }, 0);
    return formatPrice(totalPrice);
  };
  const handleCheckoutAll = () => {
    // dispatch(moveProductsToCheckout());
    // dispatch(setCheckoutProducts(cart.products));
    dispatch(clearCheckout());
    products.forEach((product) => {
      dispatch(addProductToCheckout(product));
    });
    dispatch(setCheckoutSource("cart"));
  };



  const fetchCartProducts = async (): Promise<CartProduct | null> => {

    try {
      const response = await apiClient.get<CartProduct>(
        ` ${API_ENDPOINT.GET.cart}`
      );
      // //console.log(response.data, "-=-=-=-=-=-=-=-=-=-=-");
      if (!response) {
        throw new Error("No data found");
      }

      setCartProducts(response.data)
      return response.data;
    } catch (error) {
      console.error("Failed to fetch new arrival data", error);
      return null; // Return an empty array if an error occurs
    }
  };
  const getCart = useQuery({
    queryKey: ["cart-cart"],
    queryFn: () => fetchCartProducts(),
  });
  const getReCart = useQuery({
    queryKey: ["re-cart"],
    queryFn: () => fetchCartProducts(),
  });
  interface UpdateQuantityPayload {
    cart_item_key: string;
    quantity: number;
  }
  const updateCartQuantity = async (payload: UpdateQuantityPayload) => {
    setIsQuantityUpdating(true)
    try {
      const response = await apiClient.post<UpdateQuantityPayload, CartResponse>(
        `${API_ENDPOINT.POST.updateCart}`,
        payload
      );
      return response;
    } catch (error) {
      console.error("Failed to update cart quantity", error);
      throw error;
    }
  };
  const handleQuantityChange = async (index: number, newQuantity: number, action: string) => {
    const product = cartItems[index];
    const payload = {
      cart_item_key: product.cart_item_key,
      quantity: newQuantity,
    };

    try {
      // Update the UI if the API call is successful
      await updateCartQuantity(payload);
      const updatedCartItems = [...cartItems];
      updatedCartItems[index].quantity = newQuantity;
      setCartItems(updatedCartItems);
      setIsQuantityUpdating(false)
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };
  const handleToggle = (index: number) => {
    dispatch(toggleProductOptions(index));
  };
  return (
    <Box className="cart">
      <Box className="cart-container column-space-between">
        <Box
          className="header-product-container w-100 column-space-between"
          flex={1}
        >
          <Box className={`cart-header row-space-between w-100 `}>
            <Typography className="cart-header-title">Cart</Typography>
            <CloseIcon
              width={20}
              height={20}
              sx={{
                cursor: "pointer",
                color: '#8d8d8d'
              }}
              onClick={() =>
                dispatch(
                  setCartDrawerOpen({
                    isOpen: false,
                  })
                )
              }
            />
          </Box>
          {getCart.data?.items.length === 0 && (
            <Box className="empty-cart-container h-100 column-center">
              <RemoveShoppingCartIcon
                sx={{ color: customColors.darkBlueEbco }}
                className="empty-cart-icon"
              />
              <Typography className="no-product-text">
                Your cart is empty
              </Typography>
            </Box>
          )}
          {!getCart.isFetching && cartItems.length > 0 && (
            <Box className="cart-products-container">
              {!getCart.isFetching && cartItems?.map((product: CartItemApi, index: number) => (
                <Box className="cart-product-container w-100" key={index}>
                  <Box className="cart-product-image-title-container  row-space-between">
                    <Box
                      className="image-container"
                      sx={{ position: "relative" }}
                    >
                      <CloseIcon
                        sx={{
                          color: customColors.darkBlueEbco,
                          cursor: "pointer",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "4px",
                        }}
                        className="close-icon-cart"
                        onClick={() => {
                          mutationDeletFromCart.mutate(product)
                          cartItems.splice(index, 1)
                        }}
                      />
                      <Image
                        src={product.image}
                        alt="product-image"
                        className="cart-product-image"
                        width={120}
                        height={120}
                      />
                    </Box>
                    <Box flex={1}>
                      <Typography className="cart-product-title">
                        {decodeHtml(product.name)}
                      </Typography>
                      <Box
                        className="quantity-container row-space-around"
                        sx={{
                          alignItems: "center",
                          margin: "0 1rem !important",
                        }}
                      >
                        <Typography className="size-text" mr={1}>
                          Quantity:
                        </Typography>
                        <Box className="row-space-between w-100 quantity-input">
                          <IconButton
                            aria-label="decrement"
                            disabled={product.quantity === 1 || isQuantityUpdating}
                            className="quantity-icon-container"
                            onClick={() =>
                              handleQuantityChange(
                                index,
                                product?.quantity! - 1,
                                'decrease'
                              )
                            }
                          >
                            <RemoveIcon
                              sx={{ color: customColors.orangeEbco }}
                              className="quantity-icon"
                            />
                          </IconButton>
                          <Typography>{product.quantity}</Typography>
                          <IconButton
                            aria-label="increment"
                            className="quantity-icon-container"
                            disabled={
                              isQuantityUpdating
                            }
                            onClick={() =>
                              handleQuantityChange(
                                index,
                                product?.quantity! + 1,
                                'increase'
                              )
                            }
                          >
                            <AddIcon
                              sx={{ color: customColors.orangeEbco }}
                              className="quantity-icon"
                            />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="size-quantity-container row-center">
                    {/* {product.attributes.length > 0 && (
                      <Box className="size-container row-space-between w-100">
                        <Typography className="size-text">
                          {product.attributes[0].name}:{" "}
                          <span className="size-text-value">
                            {product.selectedSize}
                          </span>{" "}
                        </Typography>
                      </Box>
                    )} */}
                    <Box className="options-container w-100">
                      {Object.entries(product.variation).map(
                        ([key, value]) => (
                          <Box
                            className="option-item row-space-between w-100"
                            key={key}
                          >
                            <Typography className="option-key" sx={{
                              textTransform: 'capitalize'
                            }}>
                              {key.replace('attribute_', '')}
                            </Typography>
                            <Typography className="option-value">
                              : {value}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  </Box>

                  <Box className="product-subTotal w-100 row-space-between">
                    <Typography className="subtotal-text">Subtotal</Typography>
                    <Typography className="subtotal-price">
                      {formatPrice(
                        Number(
                          product.price
                        ) * product?.quantity!
                      )}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        {getCart.data && (
          <>
            <Box className="total-price-container w-100 row-space-between">
              <Typography className="total-text">Total</Typography>
              <Typography className="total-price">
                {calculateTotalPrice(cartItems)}
              </Typography>
            </Box>
            <Box className="cart-action-container column-center">
              <button
                className="checkout-button"
                onClick={() => {
                  mutationClearFromCart.mutate()
                  setCartItems([])
                  dispatch(emptyCart());
                }}
              >
                Clear Cart
              </button>
              <button
                className="continue-shopping-button"
                onClick={() =>
                  dispatch(
                    setCartDrawerOpen({
                      isOpen: false,
                    })
                  )
                }
              >
                Continue shopping
              </button>
              <button
                className="checkout-button"
                onClick={() => {
                  handleCheckoutAll();
                  router.push("/checkout?is_cart=true");
                  dispatch(
                    setCartDrawerOpen({
                      isOpen: false,
                    })
                  );
                }}
              >
                Proceed to Check out
              </button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
