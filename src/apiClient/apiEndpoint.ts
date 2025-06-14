
import { ebcoApiData } from "@/utils/ebcoApiData";

export const PRODBASEURL = process.env.NEXT_PUBLIC_PROD_API_ENDPOINT;
export const DEVBASEURL = process.env.NEXT_PUBLIC_DEV_API_ENDPOINT;

const WORDPRESS = "wp-json/wp/v2";
const WOOCOMMERCE = "wp-json/wc/v3";
var modules = {};

export const API_ENDPOINT = {
  GET: {
    get_products: `${PRODBASEURL}/${WOOCOMMERCE}/products`,
    get_pinned_products: `${PRODBASEURL}/${WOOCOMMERCE}/custom-pinned-products`,
    get_categories: `${PRODBASEURL}/${WOOCOMMERCE}/products/categories`,
    get_prod_products: `${PRODBASEURL}/${WOOCOMMERCE}/products`,
    get_page: `${PRODBASEURL}/${WORDPRESS}/pages`,
    getNews_Event: `${PRODBASEURL}/${WORDPRESS}/news-event`,
    getDiscoveryCenter: `${PRODBASEURL}/${WORDPRESS}/discovery-center`,
    getVideosTable: `${PRODBASEURL}/${WORDPRESS}/news-event-category`,
    getNewsEvents: `${PRODBASEURL}/${WORDPRESS}/news-event`,
    getDistributorNetwork: `${PRODBASEURL}/${WORDPRESS}/distributor-network`,
    getDownloadsCategory: `${PRODBASEURL}/${WORDPRESS}/downloads-category`,
    getDesignerInspirationCategory: `${PRODBASEURL}/${WORDPRESS}/designer-inspiration-category`,
    getDownloadsBrochures: `${PRODBASEURL}/${WORDPRESS}/broucher-leaflet`,
    getDesignersInspiration: `${PRODBASEURL}/${WORDPRESS}/designer-inspiration`,
    getinvestorRelationCategories: `${PRODBASEURL}/${WORDPRESS}/investor-relations-category`,
    getInvestorData: `${PRODBASEURL}/${WORDPRESS}/investor-relation`,
    getCareersCategory: `${PRODBASEURL}/${WORDPRESS}/careers-category`, 
    getBlogsCategory: `${PRODBASEURL}/${WORDPRESS}/categories`,
    getCareers: `${PRODBASEURL}/${WORDPRESS}/career`,
    sendPostalCode: `${PRODBASEURL}/wp-json/custom/v1/pincode`,
    getDistributors: `${PRODBASEURL}/wp-json/custom/v1/distributor-by-pincode`,
    getOrders: `${PRODBASEURL}/${WOOCOMMERCE}/orders`,
    getMediaById: `${PRODBASEURL}/${WORDPRESS}/media`,
    getUserInfo: `${PRODBASEURL}/${WORDPRESS}/users/me`,
    handleWishlist: `${PRODBASEURL}/wp-json/wishlist/v1`,
    handleBookmark: `${PRODBASEURL}/wp-json/bookmark/v1`,
    cart: `${PRODBASEURL}/wp-json/custom/v1/get-cart`,
    handleFAQ: `${PRODBASEURL}/wp-json/wp/v2/faq`,
    clearCart: `${PRODBASEURL}/wp-json/custom/v1/clear-cart`,
    downloadPdf: `${PRODBASEURL}/wp-json/custom/v1/product-pdf`,
    getBlogs:`${PRODBASEURL}/${WORDPRESS}/posts`,
    productCollection: `${PRODBASEURL}/wp-json/bookmark/v1/collection`,
    getSegmentFocus:`${PRODBASEURL}/${WORDPRESS}/segment-focused-page`,
  },
  POST: {
    get_token: `${PRODBASEURL}/wp-json/jwt-auth/v1/token`,
    signup: `${PRODBASEURL}/wp-json/custom/v1/register`,
    sendQuery: `${PRODBASEURL}/wp-json/contact-form-7/v1/contact-forms`,
    orders: `${PRODBASEURL}/wp-json/wc/v3/orders`,
    updateOrderStatus: `${PRODBASEURL}/wp-json/custom/v1/update-order-status`,
    sendQueryDev: `https://dev.ebco.in/wp-json/contact-form-7/v1/contact-forms/3208/feedback`,
    updateUserInfo: `${PRODBASEURL}/wp-json/custom/v1/user-profile`,
    changePassword: `${PRODBASEURL}/wp-json/custom/v1/change-password`,
    getForgotPassword: `${PRODBASEURL}/wp-json/custom/v1/forgot-password`,
    setNewPassword: `${PRODBASEURL}/wp-json/custom/v1/set-new-password`,
    handleWishlist: `${PRODBASEURL}/wp-json/wishlist/v1`,
    handleBookmark: `${PRODBASEURL}/wp-json/bookmark/v1`,
    sendPostalCode: `${PRODBASEURL}/wp-json/custom/v1/pincode`,
    addCart: `${PRODBASEURL}/wp-json/custom/v1/add-to-cart`,
    removeCart: `${PRODBASEURL}/wp-json/custom/v1/remove-cart`,
    updateCart: `${PRODBASEURL}/wp-json/custom/v1/update-cart`,
    clearCart: `${PRODBASEURL}/wp-json/custom/v1/clear-cart`,
    createProductCollection: `${PRODBASEURL}/wp-json/bookmark/v1/create-collection`
    

  },
  DELETE: {},
};
