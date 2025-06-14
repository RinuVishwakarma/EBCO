'use client'
import {API_ENDPOINT} from '@/apiClient/apiEndpoint'
import {apiClient} from '@/apiClient/apiService'
import BillingAddressForm from '@/components/utils-components/BillingAddress'
import Divider from '@/components/utils-components/Divider'
import {Address} from '@/interface/Address'
import {OrderResponse,PlaceOrder} from '@/interface/OrderProduct'
import {DistributorData,PostalCodeResponse} from '@/interface/PostalCode'
import {ProductDetails} from '@/interface/productDetails'
import {
  clearCheckout,
  emptyCart,
  processOrder
} from '@/store/cart'
import {selectCheckout} from '@/store/checkout'; // Make sure the path is correct
import {useAppDispatch,useAppSelector} from '@/store/reduxHooks'
import {customColors} from '@/styles/MuiThemeRegistry/theme'
import {getStoredAuthToken} from '@/utils/authToken'
import CCAvenue from '@/utils/ccavenue'
import {inputError,useEbcoOrangeButtonStyle} from '@/utils/CommonStyling'
import formatPrice from '@/utils/formatPrice'
import AddIcon from '@mui/icons-material/Add'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {useMutation,useQuery} from '@tanstack/react-query'
import Image from 'next/image'
import {useRouter,useSearchParams} from 'next/navigation'
import {useEffect,useState} from 'react'
import {SubmitHandler,useForm} from 'react-hook-form'
import {useSelector} from 'react-redux'
import {ToastContainer,toast} from 'react-toastify'
import './Checkout.css'

import {CartItemApi,Cart as CartProduct} from '@/interface/Cart'
import {Faq} from '@/interface/FAQ'
import {decodeHtml} from '@/utils/convertHtmltoArray'
import {getCategoryByName} from '@/utils/getCategoryByName'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import 'react-toastify/dist/ReactToastify.css'

interface Status {
  status: string
}

const Checkout = () => {
  const dispatch = useAppDispatch()
  // const checkoutProducts = useSelector(selectCheckout).checkOutProducts;
  const { pendingOrder, checkOutProducts: checkoutProducts } =
    useSelector(selectCheckout)

  const router = useRouter()
  // const auth = useAppSelector((state) => state.auth);
  const [cartProducts, setCartProducts] = useState<CartItemApi[]>([])

  const [expanded, setExpanded] = useState<string | false>('panel1')
  const [openShippingAddress, setOpenShippingAddress] = useState(false)
  const handleOpenShipping = () => setOpenShippingAddress(true)
  const handleCloseShipping = () => setOpenShippingAddress(false)
  const [openBillingAddress, setOpenBillingAddress] = useState(false)
  const personalInfo = useAppSelector(state => state.auth)
  const handleCloseBilling = () => {
    if (addressData) {
      // Prefill the form with fetched data
      toast.success('Address saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        // transition: Bounce,
      })
      setOpenBillingAddress(false)
    }
  }
  const handlePaymentClose = () => setOpenPayment(false)
  const orangeEbcoButton = useEbcoOrangeButtonStyle()
  const [isPostalCodeAvailable, setIsPostalCodeAvailable] =
    useState<boolean>(false)
  const [postalError, setPostalError] = useState<string>('')
  const [openPayment, setOpenPayment] = useState(false)
  const [paymentMode, setPaymentMode] = useState<string>('')
  const query = useSearchParams()
  const auth = useAppSelector(state => state.auth)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Address>()
  const watchedPincode = watch('pincode')
  const [addressData, setAddressData] = useState<Address | null>(null)
  const [BillingAddress, setBillingAddress] = useState<Address | null>(null)
  const [pincodeDetails, setPincodeDetails] =
    useState<PostalCodeResponse | null>(null)
  const pincodeRedux = useAppSelector(state => state.pincode).pincode
  const [faqs, setFaqs] = useState<Faq[]>([])
  type SelectedOptions = {
    [key: string]: string
  }
  const convertProductsToCartItems = (
    products: ProductDetails[],
  ): CartItemApi[] => {
    return products.map(product => {
      return {
        cart_item_key: '', // Assuming this is generated elsewhere
        product_id: product?.parent_id,
        name: product.name,
        image: product.selectedImage || product.images[0]?.src || '',
        quantity: product.selectedQuantity || 1,
        price: product.price,
        total: Number(product.price) * (product.selectedQuantity || 1),
        variation_id: product.id,
        variation: convertToPayload(product.selectedOptions),
        categories: product.categories,
        type: product.type,
        discount_price:
          Number(product.regular_price) - Number(product.sale_price),
        regular_price: Number(product.regular_price),
        sale_price: Number(product.sale_price),
        selectedMrp: product?.selectedMrp,
        selectedQuantity: product.selectedQuantity,
        selectedImage: product.selectedImage || product.images[0]?.src || '',
        selectedOptions: product.selectedOptions,
        slug: product.slug,
        parent_slug: product.parent_slug,
      }
    })
  }

  const convertToPayload = (input: SelectedOptions): Record<string, string> => {
    const variation: Record<string, string> = {}

    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        const newKey = `attribute_${key.toLowerCase()}`
        variation[newKey] = input[key]
      }
    }

    return variation
  }
  const fetchCartProducts = async (): Promise<CartProduct | null> => {
    console.log('fetchCartProducts called')

    try {
      // Check if user is logged in
      const token = getStoredAuthToken();
      if (!token) {
        // If user is not logged in, get cart from localStorage
        try {
          const { getLocalCart } = await import('@/utils/localStorageCart');
          const localCart = getLocalCart();

          if (localCart && localCart.items) {
            setCartProducts(localCart.items);
            return localCart;
          } else {
            // Return empty cart if localStorage cart is empty or invalid
            return { items: [], total: '0', subtotal: '0', tax_total: 0 } as CartProduct;
          }
        } catch (error) {
          console.error('Failed to get local cart:', error);
          return { items: [], total: '0', subtotal: '0', tax_total: 0 } as CartProduct;
        }
      }

      // User is logged in, get cart from API
      const response = await apiClient.get<CartProduct>(
        ` ${API_ENDPOINT.GET.cart}`,
      )

      if (!response || !response.data) {
        throw new Error('No data found')
      }

      // Check if we need to sync localStorage cart with server
      const { getLocalCart, syncLocalCartWithServer } = await import('@/utils/localStorageCart');
      const localCart = getLocalCart();

      if (localCart && localCart.items && localCart.items.length > 0) {
        // Sync local cart with server
        await syncLocalCartWithServer();

        // Fetch updated cart from server
        const updatedResponse = await apiClient.get<CartProduct>(
          ` ${API_ENDPOINT.GET.cart}`,
        );

        if (updatedResponse && updatedResponse.data) {
          setCartProducts(updatedResponse.data.items);
          return updatedResponse.data;
        }
      }

      // If no sync needed or sync failed, use the original response
      setCartProducts(response.data.items);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart data', error);
      return { items: [], total: '0', subtotal: '0', tax_total: 0 } as CartProduct; // Return empty cart if an error occurs
    }
  }
  const getCart = useQuery({
    queryKey: ['checkout-cartt'],
    queryFn: () => fetchCartProducts(),
    enabled: false,
  })

  const updateOrder = async (id: number) => {
    // return;
    try {
      const response = await apiClient.post<Status, any>(
        `${API_ENDPOINT.POST.updateOrderStatus}/${id}`,
        {
          status: 'cancelled',
        },
      )
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response
    } catch {}
  }
  const { mutate: updateOrderMutation } = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      dispatch(processOrder(null))
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })

  // Import the tracking functions
  const {trackBeginCheckout, trackPurchase, trackCheckoutError} = require('@/utils/analyticsTracking');

  useEffect(() => {
    const syncAndCheckout = async () => {
      try {
        // Check if user is logged in and if there are items in localStorage cart
        const token = getStoredAuthToken();

        // Handle pending order if exists
        if (pendingOrder) {
          updateOrderMutation(pendingOrder);
        }

        // Sync localStorage cart with server if user is logged in
        if (token) {
          try {
            const { getLocalCart, syncLocalCartWithServer } = await import('@/utils/localStorageCart');
            const localCart = getLocalCart();

            if (localCart && localCart.items && localCart.items.length > 0) {
              // Show loading indicator
              document.body.classList.add('loading');

              // Sync local cart with server before proceeding to checkout
              await syncLocalCartWithServer();

              // Hide loading indicator
              document.body.classList.remove('loading');
            }
          } catch (error) {
            console.error('Failed to sync cart before checkout:', error);
            document.body.classList.remove('loading');
          }
        }

        // Check checkout type
        const type = query.get('is_cart');
        if (type !== null) {
          // Cart checkout
          if (token) {
            // If user is logged in, fetch from API
            try {
              const data = await getCart.refetch();
              if (data.data && data.data.items) {
                setCartProducts(data.data.items);

                // Track begin_checkout event
                trackBeginCheckout(data.data.items.map(item => ({
                  id: item.product_id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity
                })));
              }
            } catch (error) {
              console.error('Failed to fetch cart data:', error);
            }
          } else {
            // If user is not logged in, get from localStorage
            try {
              const { getLocalCart } = await import('@/utils/localStorageCart');
              const localCart = getLocalCart();
              if (localCart && localCart.items) {
                setCartProducts(localCart.items);

                // Track begin_checkout event
                trackBeginCheckout(localCart.items.map(item => ({
                  id: item.product_id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity
                })));
              }
            } catch (error) {
              console.error('Failed to get local cart:', error);
            }
          }
        } else {
          // Direct checkout from product page
          if (checkoutProducts && checkoutProducts.length > 0) {
            const newProducts = convertProductsToCartItems(checkoutProducts);
            setCartProducts(newProducts);

            // Track begin_checkout event
            trackBeginCheckout(checkoutProducts.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.selectedQuantity || 1
            })));
          }
        }

        // Set address data if user info is available
        if (personalInfo) {
          const firstName = personalInfo.first_name || '';
          const lastName = personalInfo.last_name || '';

          const address = {
            fullName: firstName + (lastName ? ' ' + lastName : ''),
            email: personalInfo.email || '',
            mobile: personalInfo.billing_phone ? Number(personalInfo.billing_phone) : null,
            flatNumber: personalInfo.billing_address_1 || '',
            addressLine2: personalInfo.billing_address_2 || '',
            GSTIN: personalInfo.gst_in || '',
          };

          // Set form values
          setValue('fullName', address.fullName);
          if (address.email) setValue('email', address.email);
          if (address.mobile) setValue('mobile', address.mobile);
          if (address.flatNumber) setValue('flatNumber', address.flatNumber);
          if (address.addressLine2) setValue('address2', address.addressLine2);

          setAddressData(address);
          setBillingAddress(address);
        }

        // Fetch pincode data if available
        if (pincodeRedux) {
          setValue('pincode', Number(pincodeRedux));
        }
      } catch (error) {
        console.error('Error in checkout initialization:', error);
        document.body.classList.remove('loading');
      }
    };

    syncAndCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkCheckoutType = async () => {
    const type = query.get('is_cart')
    const token = getStoredAuthToken();

    if (type !== null) {
      // Cart checkout
      if (token) {
        // If user is logged in, fetch from API
        const fetch = async () => {
          let data = await getCart.refetch()
          setCartProducts(data.data?.items!)
        }
        fetch()
      } else {
        // If user is not logged in, get from localStorage
        const { getLocalCart } = await import('@/utils/localStorageCart');
        const localCart = getLocalCart();
        setCartProducts(localCart.items);
      }
    } else {
      // Direct checkout from product page
      let newProducts = convertProductsToCartItems(checkoutProducts)
      setCartProducts(newProducts)
    }
  }

  const setAddressDataOnLoad = () => {
    let address = {
      fullName: personalInfo?.first_name! + personalInfo.last_name || '',
      email: personalInfo?.email || '',
      mobile: Number(personalInfo?.billing_phone) || null,
      flatNumber: personalInfo?.billing_address_1 || '',
      addressLine2: personalInfo?.billing_address_2 || '',
      GSTIN: personalInfo?.gst_in!,
    }
    setValue(
      'fullName',
      personalInfo?.first_name + ' ' + personalInfo?.last_name,
    )
    setValue('email', personalInfo?.email!)
    setValue('mobile', Number(personalInfo?.billing_phone) || null)
    setValue('flatNumber', personalInfo?.billing_address_1 || '')
    setValue('address2', personalInfo?.billing_address_2 || '')

    setAddressData(address)
    setBillingAddress(address)
  }

  useEffect(() => {
    //console.log(watchedPincode);
    setIsPostalCodeAvailable(false)
    if (watchedPincode?.toString().length === 6 && mutationPostal) {
      mutationPostal.mutate(watchedPincode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPincode])
  const [distributorData, setDistributorData] = useState<
    DistributorData | undefined
  >(undefined)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length > 6) {
      setValue('pincode', Number(value.slice(0, 6))) // Trim the input value to 6 digits
    }
  }

  useEffect(() => {
    //console.log(pincodeDetails, "pincodeDetails");
    if ((paymentMode === 'cod' || paymentMode === 'ccavenue') && mutationOrder) {
      //console.log(pincodeDetails, "pincodeDetails");
      mutationOrder.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMode])

  const fetchData = async () => {
    setValue('pincode', Number(pincodeRedux))
  }

  const placeOrder = async () => {
    try {
      // Check if user is logged in
      const token = getStoredAuthToken();
      if (!token) {
        // If user is not logged in, redirect to login page
        document.body.classList.remove('loading');
        toast.error('Please login to place an order', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });

        // Store the current URL to redirect back after login
        localStorage.setItem('url', '/checkout?is_cart=true');
        router.push('/login');
        return null;
      }

      // Check if there are items in localStorage cart and sync them with server
      const { getLocalCart, syncLocalCartWithServer } = await import('@/utils/localStorageCart');
      const localCart = getLocalCart();

      if (localCart && localCart.items && localCart.items.length > 0) {
        // Show loading indicator
        document.body.classList.add('loading');

        try {
          // Sync local cart with server before proceeding to checkout
          await syncLocalCartWithServer();

          // Refetch cart data from server
          await getCart.refetch();
        } catch (error) {
          console.error('Failed to sync cart before checkout:', error);
        }
      }

      document.body.classList.add('loading')
      let productObjects = cartProducts.map(product => {
        return {
          product_id: product.product_id,
          variation_id:
            product.type === 'variation' ? product.variation_id : undefined,
          quantity: product.quantity,
        }
      })

      let total = cartProducts.reduce((total: number, product: CartItemApi) => {
        return total + Number(product.price) * Number(product.quantity)
      }, 0) // Initial value is set to 0

      let shippingAddress = {
        first_name: addressData?.fullName!,
        address_1: addressData?.flatNumber,
        city: addressData?.city,
        state: addressData?.state,
        postcode: addressData?.pincode?.toString(),
        country: addressData?.country,
      }
      let billingAddress = {
        first_name: BillingAddress?.fullName!,
        address_1: BillingAddress?.flatNumber,
        address_2: BillingAddress?.streetName,
        city: BillingAddress?.city,
        state: BillingAddress?.state,
        postcode: BillingAddress?.pincode?.toString(),
        country: BillingAddress?.country,
        email: BillingAddress?.email!,
        phone: BillingAddress?.mobile?.toString(),
      }
      const payload = {
        payment_method: paymentMode === 'cod' ? 'cod' : 'ccavenue',
        payment_method_title:
          paymentMode === 'cod' ? 'Cash on delivery' : 'CCAvenue',
        billing: billingAddress,
        shipping: shippingAddress,
        line_items: productObjects,
        customer_id: auth.id!,
        shipping_lines:
          total < 500
            ? [
                {
                  method_id: 'flat_rate',
                  method_title: 'Flat Rate',
                  total: '100',
                },
              ]
            : undefined,
      }

      try {
        const response = await apiClient.post<PlaceOrder, OrderResponse>(
          API_ENDPOINT.POST.orders,
          {
            payment_method: paymentMode === 'cod' ? 'cod' : 'ccavenue',
            payment_method_title:
              paymentMode === 'cod' ? 'Cash on delivery' : 'CCAvenue',
            billing: billingAddress,
            status: paymentMode === 'cod' ? 'completed' : 'pending',
            shipping: shippingAddress,
            line_items: productObjects,
            customer_id: auth.id!,
            shipping_lines:
              total < 500
                ? [
                    {
                      method_id: 'flat_rate',
                      method_title: 'Flat Rate',
                      total: '100',
                    },
                  ]
                : undefined,
            meta_data: [
              {
                key: 'Distributor Code',
                value: distributorData?.seller_id,
              },
            ],
          },
        )

        document.body.classList.remove('loading')

        if (response) {
          // If payment method is COD, clear cart and redirect to success page
          if (paymentMode === 'cod') {
            // Track purchase event before clearing cart
            trackPurchase(
              response.id,
              Number(response.total),
              cartProducts.map(item => ({
                id: item.product_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
              }))
            );

            // Clear both Redux cart and localStorage cart
            dispatch(emptyCart())
            dispatch(clearCheckout())
            setCartProducts([])

            // Clear localStorage cart if user was using it
            const { clearLocalCart } = await import('@/utils/localStorageCart');
            clearLocalCart();

            router.push(`/success?data=${response.id}`)
          } else {
            // For online payment
            dispatch(processOrder(response.id))
            handleOnlinePayment(response)
          }
        }
        return response
      } catch (error) {
        console.error('Error placing order:', error);
        document.body.classList.remove('loading');

        // Track the checkout error
        trackCheckoutError('Failed to place order', {
          error_type: 'api_error',
          error_details: error instanceof Error ? error.message : 'Unknown error',
          payment_method: paymentMode,
          cart_value: total
        });

        toast.error('Failed to place order. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        return null;
      }
    } catch (error) {
      console.error('Error in place order function:', error);
      document.body.classList.remove('loading');

      // Track the checkout error
      trackCheckoutError('General checkout error', {
        error_type: 'general_error',
        error_details: error instanceof Error ? error.message : 'Unknown error',
        payment_method: paymentMode || 'unknown',
        cart_value: getTotal()
      });

      toast.error('An error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return null;
    }
  }

  const getBaseURL = () => {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }
  const handleOnlinePayment = (response: OrderResponse) => {
    // Track purchase event for online payment
    // Note: For online payments, this tracks when payment is initiated
    // Ideally, you would also track in the payment success callback
    trackPurchase(
      response.id,
      Number(response.total),
      cartProducts.map(item => ({
        id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    );

    // return;
    const host = getBaseURL()

    const token = getStoredAuthToken() ?? ''

    let paymentData = {
      merchant_id: process.env.NEXT_PUBLIC_CCAVENUE_MERCHANT_ID!, // Merchant ID (Required)
      order_id: response.id.toString(), // Order ID - It can be generated from our project
      amount: response.total.toString(), // Payment Amount (Required) response.total.toString()
      currency: 'INR', // Payment Currency Type (Required)
      billing_email: BillingAddress?.email!, // Billing Email (Optional)
      billing_name: BillingAddress?.fullName!, // Billing Name (Optional)
      billing_address: BillingAddress?.flatNumber!, // Billing Address (Optional)
      billing_city: BillingAddress?.city!, // Billing City (Optional)
      billing_state: BillingAddress?.state!, // Billing State (Optional)
      billing_zip: BillingAddress?.pincode!.toString()!, // Billing Zip (Optional)
      billing_country: BillingAddress?.country!, // Billing COuntry (Optional)
      redirect_url: `${host}/api/payment?token=${token}`, // Success URL (Required)
      cancel_url: `${host}/api/payment?token=${token}`, // Failed/Cancel Payment URL (Required)
      merchant_param1: 'Extra Information', // Extra Information (Optional)
      merchant_param2: 'Extra Information', // Extra Information (Optional)
      merchant_param3: 'Extra Information', // Extra Information (Optional)
      merchant_param4: 'Extra Information', // Extra Information (Optional)
      language: 'EN', // Language (Optional)
      billing_tel: BillingAddress?.mobile!.toString()!, // Billing Mobile Number (Optional)
      sub_account_id: distributorData?.seller_id!,
    }

    let encReq = CCAvenue.getEncryptedOrder(paymentData)
    let accessCode = process.env.NEXT_PUBLIC_CCAVENUYE_ACCESS_CODE

    // return;
    let URL = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encodeURIComponent(
      encReq,
    )}&access_code=${encodeURIComponent(accessCode!)}`
    router.push(URL)
    // window.open(URL, "_blank");
  }
  const mutationOrder = useMutation({
    mutationFn: placeOrder,
    onSuccess: async data => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove('loading')
      //console.log(data);
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error);

      // Track the checkout error
      trackCheckoutError('Order mutation error', {
        error_type: 'mutation_error',
        error_details: error instanceof Error ? error.message : 'Unknown error',
        payment_method: paymentMode || 'unknown'
      });
    },
  })

  const checkPostal = async (data: number) => {
    try {
      const response = await apiClient.get<PostalCodeResponse>(
        `${API_ENDPOINT.GET.sendPostalCode}/${data}`,
        {
          postalCode: data,
        },
      )
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response
    } catch {}
  }
  const mutationPostal = useMutation({
    mutationFn: checkPostal,
    onSuccess: async data => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove('loading')
      //console.log(data?.data, "-=-=-=-=-=POSTAL");
      if (data?.data) {
        mutation.mutate(data.data.id)
        // console.log(data.data, "Pincode details")
        setValue('city', data.data.city_name)
        setValue('state', data.data.state_name)
        setValue('country', data.data.country_name)
        setPincodeDetails(data?.data)
        let remainingAddress = {
          city: data.data.city_name,
          state: data.data.state_name,
          country: data.data.country_name,
          pincode: data.data.pincode,
        }
        //@ts-ignore
        setAddressData(prev => ({
          ...prev,
          ...remainingAddress,
        }))
        //@ts-ignore
        setBillingAddress(prev => ({
          ...prev,
          ...remainingAddress,
        }))
      }
      if (data?.data.is_deliverable === '1') {
        setIsPostalCodeAvailable(true)
      } else {
        setIsPostalCodeAvailable(false)
      }
      if (Boolean(data?.data.is_deliverable) === false) {
        toast.error('Sorry this postal code is not deliverable', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          // transition: Bounce,
        })
      }
      if (Boolean(data?.data.is_deliverable) === true) {
        setPostalError('')
      }
      if (data?.data?.status === 404) {
        setPostalError('Enter valid postal code')
      }
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })

  const fetchFaq = async (): Promise<Faq[]> => {
    try {
      const response = await apiClient.get<Faq[]>(
        ` ${API_ENDPOINT.GET.handleFAQ}?per_page=100&order=asc&orderBy=id`,
      )
      // //console.log(response, "new arrival data");
      if (!response) {
        throw new Error('No data found')
      }
      // setTotalPages(response.headers["x-wp-totalpages"]);
      // setWishlistProducts(response.data);
      setFaqs(response.data)
      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return [] // Return an empty array if an error occurs
    }
  }

  const faqQuery = useQuery({
    queryKey: ['faq-listing'],
    queryFn: fetchFaq,
    enabled: true,
  })

  const checkDistributor = async (data: number | string) => {
    try {
      const response = await apiClient.get<DistributorData[]>(
        `${API_ENDPOINT.GET.getDistributors}/${data}`,
        {
          postalCode: data,
        },
      )
      //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response
    } catch {}
  }
  const mutation = useMutation({
    mutationFn: checkDistributor,
    onSuccess: async data => {
      document.body.classList.remove('loading')
      setDistributorData(data?.data[0])
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })
  const openPaymentModal = () => {
    setOpenPayment(true)
  }

  const getTotal = () => {
    const totalPrice = cartProducts.reduce((total, product) => {
      return (
        total +
        Number(product.price ? product.price : product.price) *
          product?.quantity!
      )
    }, 0)
    return totalPrice
  }

  const getTotalPrice = () => {
    const totalPrice = cartProducts.reduce((total, product) => {
      return (
        total +
        Number(product.price ? product.price : product.price) *
          product?.quantity!
      )
    }, 0)
    let total = totalPrice < 500 ? totalPrice + 100 : totalPrice
    return formatPrice(total)
  }

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  // const handleDelete = (index: number) => {
  //   let products = cartProducts.filter((product, i) => i !== index)
  //   //console.log(products);
  //   setCartProducts([])
  //   setTimeout(() => {
  //     setCartProducts(products)
  //   }, 0)
  // }
  const handleDelete = async (index: number) => {
    try {
      // Get the token to check if user is logged in
      const token = getStoredAuthToken();
      
      // Filter out the product at the specified index
      const updatedProducts = cartProducts.filter((_, i) => i !== index);
      
      // Update the UI state
      setCartProducts(updatedProducts);

      if (token) {
        // If user is logged in, update server cart
        const productToDelete = cartProducts[index];
        if (productToDelete) {
          await apiClient.post(`${API_ENDPOINT.POST.removeCart}`, {
            cart_item_key: productToDelete.cart_item_key
          });
        }
      } else {
        // If user is not logged in, update localStorage
        const { saveLocalCart } = await import('@/utils/localStorageCart');
        saveLocalCart({ items: updatedProducts, total: '0', subtotal: '0', tax_total: 0 });
      }

      // If no products remain, clear the checkout
      if (updatedProducts.length === 0) {
        dispatch(clearCheckout());
      }

      toast.success('Item removed from cart', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to remove item from cart', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  }
  const onSubmit: SubmitHandler<Address> = data => {
    //console.log(data);
    if (watchedPincode?.toString().length !== 6) {
      toast.error('Please enter valid pincode', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        // transition: Bounce,
      })
      return
    }
    if (!isPostalCodeAvailable) {
      toast.error('Sorry this postal code is not deliverable', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        // transition: Bounce,
      })
      return
    }
    // setValue(data)
    if (data) {
      // Prefill the form with fetched data
      setAddressData(data)

      for (const key in data) {
        setValue(key as keyof Address, data[key as keyof Address])
      }
      setOpenShippingAddress(false)

      setOpenBillingAddress(true)
    }
  }

  const handleEdit = (product: CartItemApi) => {
    const category = getCategoryByName(product.categories)

    if (category) {
      const newUrl = `/${category.name.toLowerCase()}/${product.parent_slug}`
      console.log('🚀 ~ handleEdit ~ newUrl:', newUrl)
      router.push(newUrl)
    }
  }

  return (
    <>
      {mutationOrder.isPending && (
        <Box className='loader-container'>
          <Box className='loader'></Box>
        </Box>
      )}
      <Box className='checkout-wrapper'>
        <Box className='go-back-wrapper' onClick={() => router.back()}>
          <ChevronLeftIcon
            sx={{
              color: '#5b5b5b',
            }}
          />
          <Typography className='go-back-text'>Go Back</Typography>
        </Box>
        <Typography className='checkout-text-check'>
          CHECK <Typography className='checkout-text-out'>OUT</Typography>
        </Typography>
        {cartProducts?.length > 0 ? (
          <Box className='checkout-container w-100'>
            <Box
              className='column-space-between w-100 checkout-billing'
              sx={{
                alignItems: 'flex-start',
              }}
            >
              <Box className='checkout-cart'>
                {cartProducts.map((product, index) => (
                  <Box
                    key={product.product_id}
                    className='product-item row-space-between'
                    sx={{
                      alignItems: 'flex-start',
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={200}
                      height={200}
                      className='product-image-checkout'
                    />
                    <Box
                      className='product-info'
                      flex={1}
                      sx={{
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box
                        className='product-name-action row-space-between'
                        sx={{ alignItems: 'flex-start' }}
                      >
                        <Typography className='product-name-checkout'>
                          {product.name}
                        </Typography>
                        <Box className='action-container-checkout'>
                          {/* <Box
                            className='edit-product row-center'
                            onClick={() => {
                              handleEdit(product)
                            }}
                          >
                            <EditIcon
                              className='edit-icon'
                              sx={{
                                cursor: 'pointer',
                              }}
                            />{' '}
                            EDIT
                          </Box> */}
                          <Box
                            className='delete-product row-center'
                            onClick={() => handleDelete(index)}
                          >
                            <DeleteIcon className='delete-icon' /> DELETE
                          </Box>
                        </Box>
                      </Box>
                      <Box className='custom-divider'></Box>
                      <Box className='options-container w-100'>
                        {product?.variation &&
                          Object.entries(product?.variation).map(
                            ([key, value]) => {
                              // Remove the "attribute_" prefix from the key
                              const displayKey = key.replace(/^attribute_/, '')

                              return (
                                <Box
                                  className='option-item-checkout row-space-between w-100'
                                  key={key}
                                >
                                  <Typography className='option-key-checkout'>
                                    {displayKey}
                                  </Typography>
                                  <Typography className='option-value-checkout'>
                                    : {value}
                                  </Typography>
                                </Box>
                              )
                            },
                          )}
                        <Box className='option-item-checkout row-space-between w-100'>
                          <Typography className='option-key-checkout'>
                            Quantity
                          </Typography>
                          <Typography className='option-value-checkout'>
                            : {product.quantity}
                          </Typography>
                        </Box>
                        <Box className='action-container-checkout-mobile'>
                          {/* <Box
                            className='edit-product row-center'
                            onClick={() => {
                              handleEdit(product)
                            }}
                          >
                            <EditIcon
                              className='edit-icon'
                              sx={{
                                cursor: 'pointer',
                              }}
                            />{' '}
                            EDIT
                          </Box> */}
                          <Box
                            className='delete-product row-center'
                            onClick={() => handleDelete(index)}
                          >
                            <DeleteIcon className='delete-icon' /> DELETE
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              {pincodeDetails?.city_name && (
                <Box className='billing-shopping-address w-100 '>
                  <Box className='row-address-container'>
                    <Typography className='shipping-text-checkout'>
                      Shipping Address
                    </Typography>
                    <Divider width='100%' color='#dddddd' />
                    <Typography className='address-text-checkout'>
                      {addressData?.flatNumber}, {addressData?.city},
                      {addressData?.state}, {addressData?.country} -{' '}
                      {addressData?.pincode}{' '}
                    </Typography>
                    <br />
                    <Typography className='address-text-checkout'>
                      Contact: {addressData?.mobile}
                    </Typography>
                    <Typography className='address-text-checkout'>
                      {}
                    </Typography>
                  </Box>
                  <Box className='row-address-container'>
                    <Typography className='shipping-text-checkout'>
                      Billing Address
                    </Typography>
                    <Divider width='100%' color='#dddddd' />
                    <Typography className='address-text-checkout'>
                      {BillingAddress?.flatNumber}, {BillingAddress?.city},
                      {BillingAddress?.state}, {BillingAddress?.country} -{' '}
                      {BillingAddress?.pincode}{' '}
                    </Typography>
                    <br />
                    <Typography className='address-text-checkout'>
                      Contact: {BillingAddress?.mobile}
                    </Typography>
                    <Typography className='address-text-checkout'>
                      GSTIN: {BillingAddress?.GSTIN}
                    </Typography>
                  </Box>
                  <Box
                    className='edit-address row-center'
                    onClick={() => {
                      setOpenShippingAddress(true)
                    }}
                  >
                    <EditIcon
                      className='edit-icon'
                      sx={{
                        cursor: 'pointer',
                      }}
                    />{' '}
                    EDIT
                  </Box>
                </Box>
              )}
            </Box>
            <Box className='checkout-summary'>
              <Typography className='summary-text'>SUMMARY</Typography>
              <Box className='cart-summary-container'>
                {cartProducts.map(product => (
                  <Box
                    className='cart-summary-product'
                    key={product.product_id}
                  >
                    <Box className='product-name-price row-space-between'>
                      <Typography className='product-checkout-info checkout-product-title'>
                        {product.name}
                      </Typography>
                      <Typography className='product-checkout-info'>
                        {formatPrice(
                          product.regular_price !== 0
                            ? Number(product.regular_price) * product.quantity!
                            : Number(product.selectedMrp) * product.quantity!,
                        )}
                        {/* {getPrice(product.price, product.sale_price)} */}
                      </Typography>
                    </Box>
                    <Divider color='#dddddd' width='100%' />
                    <Box className='product-name-price row-space-between'>
                      <Typography className='product-checkout-info'>
                        Discounts
                      </Typography>
                      <Typography className='product-checkout-info'>
                        {' '}
                        {product.regular_price !== 0 &&
                          formatPrice(
                            Number(product.discount_price) *
                              Number(product.quantity),
                          )}
                        {product.regular_price === 0 &&
                          formatPrice(
                            Number(product.selectedMrp) *
                              Number(product.quantity) -
                              Number(product.price) * Number(product.quantity),
                          )}
                      </Typography>
                    </Box>

                    <Box className='product-name-price row-space-between'>
                      <Typography className='product-checkout-info'>
                        Subtotal
                      </Typography>
                      <Typography className='product-checkout-info'>
                        {product.regular_price !== 0 &&
                          formatPrice(
                            Number(product.sale_price) *
                              Number(product.quantity),
                          )}
                        {product.regular_price === 0 &&
                          formatPrice(
                            Number(product.price) * Number(product.quantity),
                          )}
                      </Typography>
                    </Box>
                    <Divider color='#dddddd' width='100%' />
                  </Box>
                ))}
              </Box>
              <Box className='row-space-between' p={1} px={2}>
                <Box className='row-center'>
                  <Typography className='product-checkout-info'>
                    Shipping Charges
                  </Typography>
                  <Tooltip
                    title='Shipping charges of Rs. 100 will be charged on orders below Rs. 500'
                    arrow
                  >
                    <InfoOutlinedIcon
                      sx={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                      }}
                    />
                  </Tooltip>
                </Box>
                <Typography className='product-checkout-info'>
                  {Number(getTotal()) > 500 ? formatPrice(0) : formatPrice(100)}
                </Typography>
              </Box>
              <Box className='totalPrice-container row-space-between' px={2}>
                <Typography className='product-checkout-info'>Total</Typography>
                <Typography className='product-checkout-infoTotal'>
                  {getTotalPrice()}
                </Typography>
              </Box>
              {!openBillingAddress && !openShippingAddress && (
                <Box className='proceed-to-payment-container w-100'>
                  <button
                    className=' w-100 row-center proceed-to-payment'
                    onClick={() => {
                      // console.log(BillingAddress, addressData)
                      if (
                        BillingAddress?.flatNumber &&
                        addressData?.flatNumber &&
                        BillingAddress?.pincode &&
                        addressData?.pincode
                      ) {
                        openPaymentModal()
                      } else {
                        handleOpenShipping()
                      }
                    }}
                  >
                    PROCEED TO PAYMENT
                  </button>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box className='checkout-container w-100'>
            <Typography className='empty-cart-text'>
              No Products added for checkout
            </Typography>
          </Box>
        )}
        <Box className='faq-bumrah-banner-container w-100 '>
          <Box className='faq-container w-100'>
            <Box className='faq-container-header '>
              <Typography className='faq-text'>
                FREQUENTLY ASKED{' '}
                <Typography className='faq-text-bold'>QUESTIONS</Typography>
              </Typography>
            </Box>
            <Box className='faq'>
              {faqs.map(accordion => (
                <Accordion
                  key={accordion.id}
                  expanded={expanded === accordion.id.toString()}
                  className='accordion-custom'
                  onChange={handleChange(accordion.id.toString())}
                  sx={{
                    boxShadow:
                      expanded === accordion.id.toString()
                        ? '0 1px 10px #ddd !important;'
                        : 'none',
                  }}
                >
                  <AccordionSummary
                    aria-controls={`${accordion.id}-content`}
                    id={`${accordion.id}-header`}
                    expandIcon={
                      expanded === accordion.id.toString() ? (
                        <RemoveIcon
                          sx={{
                            color: '#092853',
                          }}
                        />
                      ) : (
                        <AddIcon
                          sx={{
                            color: '#092853',
                          }}
                        />
                      )
                    }
                  >
                    <Typography className='accordion-text'>
                      {decodeHtml(accordion.title.rendered)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className='accordion-details'>
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
      </Box>
      <Modal
        open={openShippingAddress}
        onClose={handleCloseShipping}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        className='address-modal row-center'
      >
        <Box
          sx={{
            width: '50vw',
            height: '80vh',
            background: customColors.whiteEbco,
            outline: 'none',
            position: 'relative',
            borderRadius: '8px',
            justifyContent: 'flex-start',
          }}
          className='column-center shipping-modal-container'
        >
          <CancelOutlinedIcon
            sx={{
              color: customColors.darkBlueEbco,
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
            }}
            className='visit-center-close'
            onClick={handleCloseShipping}
          />
          <Image
            src={'/images/darkLogoEbco.png'}
            alt='Ebco Logo'
            width={100}
            height={70}
          />
          <Typography
            sx={{
              color: customColors.darkBlueEbco,
              fontFamily: 'Uniform Bold',
            }}
            className='visit-center-title'
          >
            Enter Shipping Address
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=' w-100 checkout-address'
            style={{}}
          >
            <Box className='row-space-between input-row checkout-input w-50'>
              <Box
                className='input-section column-space-between w-100'
                sx={{
                  alignItems: 'flex-start',
                }}
              >
                <TextField
                  id='name'
                  label='Name *'
                  type='text'
                  className='contact-us-input no-padding'
                  placeholder='Full Name *'
                  style={{
                    color: customColors.lightGreyEbco,
                    padding: '0 !important',
                  }}
                  {...register('fullName', {
                    required: true,
                    validate: value =>
                      (value && value.trim().length > 0) || 'Enter full name',
                  })}
                />

                {errors.fullName?.type === 'required' && (
                  <p role='alert' style={inputError}>
                    Full name is required
                  </p>
                )}
              </Box>
            </Box>
            <Box className='row-space-between input-row checkout-input w-50'>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                <TextField
                  id='number'
                  type='number'
                  label='Mobile Number *'
                  className='contact-us-input no-padding'
                  placeholder='Enter Mobile *'
                  style={{
                    color: customColors.lightGreyEbco,
                    padding: '0 !important',
                  }}
                  {...register('mobile', {
                    required: true,
                    validate: value =>
                      (value && value.toString().trim().length > 0) ||
                      'Enter Mobile Number',
                  })}
                />

                {errors.mobile?.type === 'required' && (
                  <p role='alert' style={inputError}>
                    Mobile Number is required
                  </p>
                )}
              </Box>
            </Box>
            <Box className='row-space-between input-row checkout-input w-100'>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                <TextField
                  label='Email *'
                  id='email'
                  type='email'
                  className='contact-us-input no-padding'
                  placeholder='Enter Email Address *'
                  style={{
                    color: customColors.lightGreyEbco,
                    padding: '0 !important',
                  }}
                  {...register('email', {
                    required: true,
                    validate: value =>
                      (value && value.toString().trim().length > 0) ||
                      'Enter Email address',
                  })}
                />

                {errors.email?.type === 'required' && (
                  <p role='alert' style={inputError}>
                    Email is required
                  </p>
                )}
              </Box>
            </Box>
            <Box className='row-space-between input-row checkout-input w-50'>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                <TextField
                  label='Pincode *'
                  id='number'
                  type='number'
                  className='contact-us-input no-padding'
                  placeholder='Enter Pincode *'
                  maxLength={6}
                  max={999999}
                  style={{
                    color: customColors.lightGreyEbco,
                    padding: '0 !important',
                  }}
                  // disabled={watchedPincode.toString().length === 6}
                  onInput={handleInputChange}
                  {...register('pincode', {
                    required: true,
                    validate: value =>
                      (value && value.toString().trim().length > 0) ||
                      'Enter pincode',
                  })}
                />

                {errors.pincode?.type === 'required' && (
                  <p role='alert' style={inputError}>
                    Pincode is required
                  </p>
                )}
                {postalError && (
                  <p role='alert' style={inputError}>
                    {postalError}
                  </p>
                )}
              </Box>
            </Box>
            <Box className='row-space-between input-row checkout-input w-50'>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                <TextField
                  label='Address Line 1 *'
                  id='text'
                  type='text'
                  className='contact-us-input no-padding'
                  placeholder='Address Line 1 *'
                  style={{
                    color: customColors.lightGreyEbco,
                    padding: '0 !important',
                  }}
                  {...register('flatNumber', {
                    required: true,
                    validate: value =>
                      (value && value.toString().trim().length > 0) ||
                      'Enter flat number and building name',
                  })}
                />

                {errors.flatNumber?.type === 'required' && (
                  <p role='alert' style={inputError}>
                    Enter flat number and building name
                  </p>
                )}
              </Box>
            </Box>
            <Box className='row-space-between input-row checkout-input w-50'>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                <TextField
                  label='Address Line 2 '
                  id='text'
                  type='text'
                  className='contact-us-input no-padding'
                  placeholder='Address Line 2'
                  style={{
                    color: customColors.lightGreyEbco,
                    padding: '0 !important',
                  }}
                  {...register('address2')}
                />
              </Box>
            </Box>
            <Box className='row-space-between input-row checkout-input w-50'>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                {/* <input */}
                <TextField
                  label='City *'
                  id='city'
                  type='text'
                  defaultValue=''
                  InputProps={{ inputProps: { min: 0 } }}
                  InputLabelProps={{ shrink: true }}
                  className='contact-us-input no-padding'
                  placeholder=''
                  disabled
                  value={pincodeDetails?.city_name}
                  style={{
                    color: customColors.lightGreyEbco,
                    padding: '0 !important',
                  }}
                  {...register('city')}
                />
              </Box>
            </Box>
            <Box className='row-space-between input-row checkout-input w-50'>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                <TextField
                  label='State *'
                  id='state'
                  type='text'
                  disabled
                  value={pincodeDetails?.state_name}
                  InputProps={{ inputProps: { min: 0 } }}
                  InputLabelProps={{ shrink: true }}
                  className='contact-us-input no-padding'
                  placeholder=''
                  style={{
                    color: customColors.lightGreyEbco,
                    padding: '0 !important',
                  }}
                  {...register('state')}
                />
              </Box>
            </Box>
            <Box className='row-space-between input-row checkout-input w-50'>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                <TextField
                  label='Country *'
                  id='country'
                  type='text'
                  InputProps={{ inputProps: { min: 0 } }}
                  InputLabelProps={{ shrink: true }}
                  className='contact-us-input no-padding'
                  placeholder=''
                  disabled
                  value={pincodeDetails?.country_name}
                  style={{
                    color: customColors.lightGreyEbco,
                    padding: '0 !important',
                  }}
                  {...register('country')}
                />
              </Box>
            </Box>
            <button
              className='submit-btn'
              type='submit'
              style={{ ...orangeEbcoButton, marginTop: '2rem' }}
            >
              SAVE AND PROCEED
            </button>
          </form>
        </Box>
      </Modal>
      <BillingAddressForm
        open={openBillingAddress}
        handleClose={handleCloseBilling}
        initialValues={BillingAddress}
        setAddressData={setBillingAddress}
        shippingAddress={addressData}
      />
      <Modal
        open={openPayment}
        onClose={handlePaymentClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        className='address-modal row-center'
      >
        <Box
          sx={{
            background: customColors.whiteEbco,
            outline: 'none',
            position: 'relative',
            borderRadius: '8px',
            justifyContent: 'flex-start',
            padding: '3rem',
          }}
          className='column-space-between'
        >
          <CancelOutlinedIcon
            sx={{
              color: customColors.darkBlueEbco,
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
            }}
            className='visit-center-close'
            onClick={handlePaymentClose}
          />
          <Typography
            sx={{
              color: customColors.darkBlueEbco,
              fontSize: '1.5rem',
              fontWeight: 500,
              marginBottom: '1rem',
              fontFamily: 'Uniform Bold !important',
            }}
          >
            Select mode of payment
          </Typography>

          <Box className='row-space-between'>
            <Tooltip
              title={
                pincodeDetails?.is_cod === '0' &&
                `Your pincode ${pincodeDetails.pincode} is not available for Cash On Delivery`
              }
            >
              <Button
                variant='contained'
                disabled={pincodeDetails?.is_cod === '0'}
                sx={{
                  color: customColors.whiteEbco,
                  backgroundColor: customColors.orangeEbco,
                  '&:hover': {
                    backgroundColor:
                      pincodeDetails?.is_cod !== '0'
                        ? customColors.orangeEbco
                        : '#dddddd',
                  },
                }}
                onClick={() => {
                  //console.log("cod");
                  setPaymentMode('cod')
                  // handlePayment();
                  handlePaymentClose()
                }}
              >
                Cash On Delivery
              </Button>
            </Tooltip>
            <Button
              variant='contained'
              disabled={!pincodeDetails?.is_deliverable}
              sx={{
                color: customColors.whiteEbco,
                backgroundColor: customColors.orangeEbco,
                marginLeft: '1rem',
                '&:hover': {
                  backgroundColor: customColors.orangeEbco,
                },
              }}
              onClick={() => {
                setPaymentMode('ccavenue')
                // handlePayment();
              }}
            >
              CCAvenue
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  )
}

export default Checkout
