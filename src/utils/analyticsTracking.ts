/**
 * Utility functions for tracking analytics events
 */

// Define the window dataLayer property for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Define the viewed products structure
interface ViewedProducts {
  [key: string]: {
    timestamp: number;
    viewed: boolean;
  };
}

/**
 * Track a product view event in Google Analytics
 * @param product The product being viewed
 */
export const trackProductView = (product: {
  id: number | string;
  name: string;
  price: string | number;
}) => {
  if (typeof window === 'undefined') return;

  // Validate product data
  if (!product || !product.id) {
    console.warn('Invalid product data for tracking view event');
    return;
  }

  // const viewedProductsKey = 'ebco_viewed_products';
  // let viewedProducts: ViewedProducts = {};

  // try {
  //   const storedData = localStorage.getItem(viewedProductsKey);
  //   if (storedData) {
  //     viewedProducts = JSON.parse(storedData);
  //   }
  // } catch (error) {
  //   console.error('Error parsing viewed products from localStorage:', error);
  // }

  // // Creating unique key for this product view
  // const productKey = `product_${product.id}`;

  // // If tracked , don't track it again
  // if (viewedProducts[productKey]) {
  //   console.log('Product already viewed, not tracking again:', product.name);
  //   return;
  // }

  // // Mark this product as viewed
  // viewedProducts[productKey] = {
  //   timestamp: Date.now(),
  //   viewed: true
  // };

  // try {
  //   localStorage.setItem(viewedProductsKey, JSON.stringify(viewedProducts));
  // } catch (error) {
  //   console.error('Error saving viewed products to localStorage:', error);
  // }

  let price = 0;
  try {
    price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    if (isNaN(price)) price = 0;
  } catch (e) {
    console.warn('Error parsing product price:', e);
  }

  try {
    window.dataLayer = window.dataLayer || [];

    // Clear the ecommerce object first (GA4 requirement)
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        currency: 'INR',
        value: price,
        items: [{
          item_id: product.id.toString(),
          item_name: product.name,
          price: price,
          quantity: 1
        }]
      }
    });

    console.log('Product view tracked:', product.name, 'with ID:', product.id, 'dataLayer:', window.dataLayer);
  } catch (error) {
    console.error('Error pushing event to dataLayer:', error);
  }
};

/**
 * Track when a product is added to cart
 * @param product The product being added to cart
 * @param quantity The quantity being added
 */
export const trackAddToCart = (product: {
  id: number | string;
  name: string;
  price: string | number;
  quantity: number;
}) => {
  if (typeof window === 'undefined') return;

  if (!product || !product.id) {
    console.warn('Invalid product data for tracking add_to_cart event');
    return;
  }

  let price = 0;
  try {
    price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    if (isNaN(price)) price = 0;
  } catch (e) {
    console.warn('Error parsing product price:', e);
  }

  try {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({ ecommerce: null });

    const totalValue = price * (product.quantity || 1);

    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'INR',
        value: totalValue,
        items: [{
          item_id: product.id.toString(),
          item_name: product.name,
          price: price,
          quantity: product.quantity || 1
        }]
      }
    });

    console.log('Add to cart event tracked:', product.name, 'with quantity:', product.quantity, 'dataLayer:', window.dataLayer);
  } catch (error) {
    console.error('Error pushing add_to_cart event to dataLayer:', error);
  }
};

/**
 * Track when a user begins the checkout process
 * @param items Array of cart items being checked out
 */
export const trackBeginCheckout = (items: Array<{
  id: number | string;
  name: string;
  price: string | number;
  quantity: number;
}>) => {
  if (typeof window === 'undefined') return;

  // Validate items data
  if (!items || !items.length) {
    console.warn('Invalid items data for tracking begin_checkout event');
    return;
  }

  try {
    // Check if already tracked a checkout in this session
    const trackedCheckoutKey = 'ebco_tracked_checkout';

    // Define the type for tracked checkout
    interface TrackedCheckout {
      timestamp: number;
      itemCount: number;
    }

    let hasTrackedCheckout = false;

    try {
      const storedData = localStorage.getItem(trackedCheckoutKey);
      if (storedData) {
        const trackedCheckout: TrackedCheckout = JSON.parse(storedData);

        // Check if we've tracked a checkout in the last 10 minutes (600000 ms)
        const tenMinutesAgo = Date.now() - 600000;
        if (trackedCheckout.timestamp > tenMinutesAgo) {
          hasTrackedCheckout = true;
          console.log('Checkout already tracked in the last 10 minutes, not tracking again.');
        }
      }
    } catch (error) {
      console.error('Error parsing tracked checkout from localStorage:', error);
    }

    // If already tracked a checkout recently, don't track it again
    if (hasTrackedCheckout) {
      return;
    }

    // Format the items for GA4
    const formattedItems = items.map(item => {
      let price = 0;
      try {
        price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        if (isNaN(price)) price = 0;
      } catch (e) {
        console.warn('Error parsing item price:', e);
      }

      return {
        item_id: item.id.toString(),
        item_name: item.name,
        price: price,
        quantity: item.quantity || 1
      };
    });

    const totalValue = formattedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'INR',
        value: totalValue,
        items: formattedItems
      }
    });

    // Mark this checkout as tracked
    try {
      localStorage.setItem(trackedCheckoutKey, JSON.stringify({
        timestamp: Date.now(),
        itemCount: items.length
      }));
    } catch (error) {
      console.error('Error saving tracked checkout to localStorage:', error);
    }

    console.log('Begin checkout event tracked with', items.length, 'items');
  } catch (error) {
    console.error('Error pushing begin_checkout event to dataLayer:', error);
  }
};

/**
 * Track when a purchase is completed
 * @param orderId The order ID
 * @param total The total value of the order
 * @param items Array of items purchased
 */
export const trackPurchase = (orderId: string | number, total: number, items: Array<{
  id: number | string;
  name: string;
  price: string | number;
  quantity: number;
}>) => {
  if (typeof window === 'undefined') return;

  if (!orderId || !items || !items.length) {
    console.warn('Invalid data for tracking purchase event');
    return;
  }

  try {
    const trackedPurchasesKey = 'ebco_tracked_purchases';

    interface TrackedPurchase {
      timestamp: number;
      total: number;
    }

    interface TrackedPurchases {
      [key: string]: TrackedPurchase;
    }

    let trackedPurchases: TrackedPurchases = {};

    try {
      const storedData = localStorage.getItem(trackedPurchasesKey);
      if (storedData) {
        trackedPurchases = JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error parsing tracked purchases from localStorage:', error);
    }

    const purchaseKey = `order_${orderId}`;

    if (trackedPurchases[purchaseKey]) {
      console.log('Purchase already tracked, not tracking again. Order ID:', orderId);
      return;
    }

    const formattedItems = items.map(item => {
      let price = 0;
      try {
        price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        if (isNaN(price)) price = 0;
      } catch (e) {
        console.warn('Error parsing item price:', e);
      }

      return {
        item_id: item.id.toString(),
        item_name: item.name,
        price: price,
        quantity: item.quantity || 1
      };
    });

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: orderId.toString(),
        value: total,
        currency: 'INR',
        items: formattedItems
      }
    });

    trackedPurchases[purchaseKey] = {
      timestamp: Date.now(),
      total: total
    };

    try {
      localStorage.setItem(trackedPurchasesKey, JSON.stringify(trackedPurchases));
    } catch (error) {
      console.error('Error saving tracked purchases to localStorage:', error);
    }

    console.log('Purchase event tracked for order:', orderId, 'with total:', total);
  } catch (error) {
    console.error('Error pushing purchase event to dataLayer:', error);
  }
};


/**
 * Track checkout errors such as payment failures
 * @param errorMessage The error message
 * @param additionalInfo Optional additional information about the error
 */
export const trackCheckoutError = (errorMessage: string, additionalInfo?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  if (!errorMessage) {
    console.warn('Invalid data for tracking checkout error event');
    return;
  }

  try {
    window.dataLayer = window.dataLayer || [];

    const eventData: Record<string, any> = {
      event: 'checkout_error',
      error_message: errorMessage
    };

    if (additionalInfo) {
      Object.keys(additionalInfo).forEach(key => {
        eventData[key] = additionalInfo[key];
      });
    }

    window.dataLayer.push(eventData);

    console.log('Checkout error event tracked:', errorMessage, additionalInfo || '');
  } catch (error) {
    console.error('Error pushing checkout error event to dataLayer:', error);
  }
};

