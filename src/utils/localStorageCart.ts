import {API_ENDPOINT} from "@/apiClient/apiEndpoint";
import {apiClient} from "@/apiClient/apiService";
import {Cart,CartItemApi} from "@/interface/Cart";

// Constants for localStorage keys
const LOCAL_CART_KEY = "ebco_local_cart";

// Initialize localStorage cart if it doesn't exist
export const initLocalCart = (): void => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(LOCAL_CART_KEY)) {
    const emptyCart: Cart = {
      items: [],
      total: "0",
      subtotal: "0",
      tax_total: 0
    };
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(emptyCart));
  }
};

// Get cart from localStorage
export const getLocalCart = (): Cart => {
  if (typeof window === "undefined") {
    return {
      items: [],
      total: "0",
      subtotal: "0",
      tax_total: 0
    };
  }

  initLocalCart();
  const cartData = localStorage.getItem(LOCAL_CART_KEY);
  return cartData ? JSON.parse(cartData) : {
    items: [],
    total: "0",
    subtotal: "0",
    tax_total: 0
  };
};

// Save cart to localStorage
export const saveLocalCart = (cart: Cart): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
};

// Add item to cart
export const addItemToLocalCart = (item: CartItemApi): void => {
  const cart = getLocalCart();

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    cartItem => cartItem.product_id === item.product_id &&
                cartItem.variation_id === item.variation_id
  );

  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    cart.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Generate a unique cart_item_key for the local cart item
    const localCartItemKey = `local_${item.product_id}_${item.variation_id}_${Date.now()}`;
    cart.items.push({
      ...item,
      cart_item_key: localCartItemKey
    });
  }

  // Update cart totals
  updateLocalCartTotals(cart);

  // Save updated cart
  saveLocalCart(cart);
};

// Remove item from cart
export const removeItemFromLocalCart = (cartItemKey: string): void => {
  const cart = getLocalCart();

  cart.items = cart.items.filter(item => item.cart_item_key !== cartItemKey);

  // Update cart totals
  updateLocalCartTotals(cart);

  // Save updated cart
  saveLocalCart(cart);
};

// Update item quantity in cart
export const updateLocalCartItemQuantity = (cartItemKey: string, quantity: number): void => {
  const cart = getLocalCart();

  const itemIndex = cart.items.findIndex(item => item.cart_item_key === cartItemKey);

  if (itemIndex !== -1) {
    cart.items[itemIndex].quantity = quantity;

    // Update cart totals
    updateLocalCartTotals(cart);

    // Save updated cart
    saveLocalCart(cart);
  }
};

// Clear cart
export const clearLocalCart = (): void => {
  const emptyCart: Cart = {
    items: [],
    total: "0",
    subtotal: "0",
    tax_total: 0
  };

  saveLocalCart(emptyCart);
};

// Helper function to update cart totals
const updateLocalCartTotals = (cart: Cart): void => {
  let subtotal = 0;

  cart.items.forEach(item => {
    const price = item.sale_price ? item.sale_price : Number(item.price);
    subtotal += price * item.quantity;
  });

  // For simplicity, we're not calculating tax here
  const tax = 0;
  const total = subtotal + tax;

  cart.subtotal = subtotal.toString();
  cart.tax_total = tax;
  cart.total = total.toString();
};

// Sync local cart with server cart
export const syncLocalCartWithServer = async (): Promise<void> => {
  if (typeof window === "undefined") return;

  try {
    // First, get the server cart to ensure we have a valid session
    await apiClient.get<Cart>(`${API_ENDPOINT.GET.cart}`);

    // Get the local cart
    const localCart = getLocalCart();

    // If local cart is empty, no need to sync
    if (localCart.items.length === 0) {
      return;
    }

    // Add each local cart item to the server cart
    for (const item of localCart.items) {
      await apiClient.post(`${API_ENDPOINT.POST.addCart}`, {
        product_id: item.product_id,
        quantity: item.quantity,
        variation_id: item.variation_id,
        variation: item.variation
      });
    }

    // Clear the local cart after syncing
    clearLocalCart();

  } catch (error) {
    console.error("Failed to sync local cart with server:", error);
  }
};
