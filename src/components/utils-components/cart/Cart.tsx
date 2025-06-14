"use client";
import {API_ENDPOINT} from "@/apiClient/apiEndpoint";
import {apiClient} from "@/apiClient/apiService";
import {CartItemApi,Cart as CartProduct,CartResponse} from "@/interface/Cart";
import {
  addProductToCheckout,
  clearCheckout,
  emptyCart,
  setCheckoutSource
} from "@/store/cart";
import {setCartProductsCount} from "@/store/cartCount";
import {setCartDrawerOpen} from "@/store/cartDrawer";
import {useAppDispatch,useAppSelector} from "@/store/reduxHooks";
import {setUrl} from "@/store/routeUrl";
import {customColors} from "@/styles/MuiThemeRegistry/theme";
import "@/styles/productDetails.css";
import {getStoredAuthToken} from "@/utils/authToken";
import {decodeHtml} from "@/utils/convertHtmltoArray";
import formatPrice from "@/utils/formatPrice";
import {clearLocalCart,getLocalCart,removeItemFromLocalCart,updateLocalCartItemQuantity} from "@/utils/localStorageCart";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import {Box,IconButton,Typography} from "@mui/material";
import {useMutation,useQuery} from "@tanstack/react-query";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect,useState} from "react";
import "./cart.css";


const Cart = () => {
  const products = useAppSelector((state) => state.cart.products);
  const [isQuantityUpdating, setIsQuantityUpdating] = useState(false)
  const dispatch = useAppDispatch();
  const router = useRouter();
  // We need to keep cartProducts state for type consistency, even if we don't directly use it
  const [cartProducts, setCartProducts] = useState<CartProduct>()
  const [cartItems, setCartItems] = useState<CartItemApi[] | []>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = getStoredAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  // Initialize cart data
  useEffect(() => {
    const fetchCartData = async () => {
      if (isLoggedIn) {
        // If user is logged in, we'll fetch cart in the query below
      } else {
        // If user is not logged in, get cart from localStorage
        const localCart = getLocalCart();
        setCartProducts(localCart);
        setCartItems(localCart.items);
        // Update cart count in the header
        dispatch(setCartProductsCount(localCart.items.length));
      }
    };
    fetchCartData();
  }, [isLoggedIn, dispatch]);
  interface ProductPayload {
    cart_item_key: string
  }

  const refetch = async () => {
    if (isLoggedIn) {
      // If user is logged in, refetch from API
      let data = await getReCart.refetch()
      dispatch(setCartProductsCount(data.data?.items.length!))
    } else {
      // If user is not logged in, get from localStorage
      const localCart = getLocalCart();
      setCartProducts(localCart);
      setCartItems(localCart.items);
      dispatch(setCartProductsCount(localCart.items.length));
    }
  }

  const DeleteFromCart = async (product: CartItemApi) => {
    if (isLoggedIn) {
      try {
        const response = await apiClient.post<ProductPayload, CartResponse>(
          `${API_ENDPOINT.POST.removeCart}`, {
          cart_item_key: product.cart_item_key
        });
        return response;
      } catch { }
    } else {
      // If user is not logged in, remove from localStorage
      removeItemFromLocalCart(product.cart_item_key);
      return { success: true } as CartResponse;
    }
  };

  const mutationDeletFromCart = useMutation({
    mutationFn: DeleteFromCart,
    onSuccess: async () => {
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
    if (isLoggedIn) {
      try {
        const response = await apiClient.get<CartResponse>(
          `${API_ENDPOINT.GET.clearCart}`);
        return response;
      } catch { }
    } else {
      // If user is not logged in, clear localStorage cart
      clearLocalCart();
      return { success: true } as CartResponse;
    }
  };

  const mutationClearFromCart = useMutation({
    mutationFn: ClearCart,
    onSuccess: async () => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove("loading");
      setCartItems([])
      refetch()
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
    if (isLoggedIn) {
      try {
        const response = await apiClient.get<CartProduct>(
          ` ${API_ENDPOINT.GET.cart}`
        );
        if (!response) {
          throw new Error("No data found");
        }

        setCartProducts(response.data)
        return response.data;
      } catch (error) {
        console.error("Failed to fetch cart data", error);
        return null;
      }
    } else {
      // If user is not logged in, return cart from localStorage
      const localCart = getLocalCart();
      return localCart;
    }
  };

  const getCart = useQuery({
    queryKey: ["cart-cart"],
    queryFn: () => fetchCartProducts(),
    enabled: isLoggedIn, // Only run this query if user is logged in
  });

  const getReCart = useQuery({
    queryKey: ["re-cart"],
    queryFn: () => fetchCartProducts(),
    enabled: isLoggedIn, // Only run this query if user is logged in
  });

  // Effect to update cart items when API data changes
  useEffect(() => {
    if (isLoggedIn && getCart.data) {
      setCartItems(getCart.data.items || []);
      dispatch(setCartProductsCount(getCart.data.items?.length || 0));
    }
  }, [getCart.data, isLoggedIn, dispatch]);

  // Effect to sync local cart with server when user logs in
  useEffect(() => {
    // Track previous login state
    const prevIsLoggedIn = localStorage.getItem('prev_login_state') === 'true';

    // If user just logged in and there are items in localStorage cart, sync with server
    if (isLoggedIn && !prevIsLoggedIn) {
      const syncCart = async () => {
        try {
          // Get the local cart
          const localCart = getLocalCart();

          // Only sync if there are items in the local cart
          if (localCart.items.length > 0) {
            // Import the syncLocalCartWithServer function dynamically
            const { syncLocalCartWithServer } = await import('@/utils/localStorageCart');
            await syncLocalCartWithServer();

            // After syncing, refetch the cart from the server
            await getCart.refetch();
          }
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      };

      syncCart();
    }

    // Store current login state for next comparison
    localStorage.setItem('prev_login_state', isLoggedIn.toString());
  }, [isLoggedIn, getCart]);
  interface UpdateQuantityPayload {
    cart_item_key: string;
    quantity: number;
  }
  const updateCartQuantity = async (payload: UpdateQuantityPayload) => {
    setIsQuantityUpdating(true)
    if (isLoggedIn) {
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
    } else {
      // If user is not logged in, update quantity in localStorage
      updateLocalCartItemQuantity(payload.cart_item_key, payload.quantity);
      return { success: true } as CartResponse;
    }
  };

  const handleQuantityChange = async (index: number, newQuantity: number) => {
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
          {(isLoggedIn ? getCart.data?.items.length === 0 : cartItems.length === 0) && (
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
          {cartItems.length > 0 && (
            <Box className="cart-products-container">
              {cartItems?.map((product: CartItemApi, index: number) => (
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
                                product?.quantity! - 1
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
                                product?.quantity! + 1
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
        {cartItems.length > 0 && (
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
                className="checkout-button"
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
                className="continue-shopping-button"
                onClick={async () => {
                  if (!isLoggedIn) {
                    // If user is not logged in, redirect to login page

                    // Store the current URL to redirect back after login
                    dispatch(
                      setUrl({
                        url: '/checkout?is_cart=true',
                      })
                    );
                    localStorage.setItem('url', '/checkout?is_cart=true');

                    // Close the cart drawer
                    dispatch(
                      setCartDrawerOpen({
                        isOpen: false,
                      })
                    );

                    // Redirect to login page
                    router.push('/login');
                  } else {
                    // If user is logged in, check if there are items in localStorage cart
                    const localCart = getLocalCart();

                    if (localCart.items.length > 0) {
                      // Show loading indicator
                      document.body.classList.add('loading');

                      try {
                        // Sync local cart with server before proceeding to checkout
                        const { syncLocalCartWithServer } = await import('@/utils/localStorageCart');
                        await syncLocalCartWithServer();

                        // Refetch cart data from server
                        await getCart.refetch();

                        // Hide loading indicator
                        document.body.classList.remove('loading');
                      } catch (error) {
                        console.error('Failed to sync cart before checkout:', error);
                        document.body.classList.remove('loading');
                      }
                    }

                    // Proceed to checkout
                    handleCheckoutAll();
                    router.push("/checkout?is_cart=true");
                    dispatch(
                      setCartDrawerOpen({
                        isOpen: false,
                      })
                    );
                  }
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