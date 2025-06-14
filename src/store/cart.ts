import {ProductDetails} from "@/interface/productDetails";
import {createSlice,PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";

interface CartState {
  products: ProductDetails[];
  checkOutProducts: ProductDetails[];
  checkoutSource: "cart" | "buyNow";
  pendingOrder: number | null;
}

const initialState: CartState = {
  products: [],
  checkOutProducts: [],
  checkoutSource: "cart",
  pendingOrder: null,
};

// Helper function to compare selectedOptions
const areSelectedOptionsEqual = (
  options1: Record<string, string>,
  options2: Record<string, string>
): boolean => {
  const keys1 = Object.keys(options1);
  const keys2 = Object.keys(options2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (options1[key] !== options2[key]) return false;
  }

  return true;
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<ProductDetails>) => {
      const newProduct = action.payload;
      const existingProductIndex = state.products.findIndex(
        (p) =>
          p.id === newProduct.id &&
          areSelectedOptionsEqual(p.selectedOptions, newProduct.selectedOptions)
      );

      let updatedQuantity = newProduct.selectedQuantity || 0;

      if (existingProductIndex !== -1) {
        updatedQuantity +=
          state.products[existingProductIndex].selectedQuantity || 0;
        state.products.splice(existingProductIndex, 1);
      }

      state.products.push({
        ...newProduct,
        selectedQuantity: updatedQuantity,
        isEdit: false,
        isOptionsOpen: false,
      });
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.products.splice(action.payload, 1);
    },
    updateProduct: (
      state,
      action: PayloadAction<{ index: number; product: ProductDetails }>
    ) => {
      const { index, product } = action.payload;
      if (state.products[index]) {
        state.products[index] = product;
      }
    },
    updateProductOptions: (
      state,
      action: PayloadAction<{
        index: number;
        selectedOptions: Record<string, string>;
      }>
    ) => {
      const { index, selectedOptions } = action.payload;
      if (state.products[index]) {
        state.products[index].selectedOptions = selectedOptions;
      }
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{ index: number; quantity: number }>
    ) => {
      const { index, quantity } = action.payload;
      if (state.products[index]) {
        state.products[index].selectedQuantity = quantity;
      }
    },
    emptyCart: (state) => {
      state.products = [];
    },
    addProductToCheckout: (state, action: PayloadAction<ProductDetails>) => {
      state.checkOutProducts.push(action.payload);
    },
    removeProductFromCheckout: (state, action: PayloadAction<number>) => {
      state.checkOutProducts.splice(action.payload, 1);
    },
    clearCheckout: (state) => {
      state.checkOutProducts = [];
    },
    updateProductInCheckout: (
      state,
      action: PayloadAction<{ index: number; product: ProductDetails }>
    ) => {
      const { index, product } = action.payload;
      if (state.checkOutProducts[index]) {
        state.checkOutProducts[index] = product;
      }
    },
    updateProductOptionsInCheckout: (
      state,
      action: PayloadAction<{
        index: number;
        selectedOptions: Record<string, string>;
      }>
    ) => {
      const { index, selectedOptions } = action.payload;
      if (state.checkOutProducts[index]) {
        state.checkOutProducts[index].selectedOptions = selectedOptions;
      }
    },
    updateProductQuantityInCheckout: (
      state,
      action: PayloadAction<{ index: number; quantity: number }>
    ) => {
      const { index, quantity } = action.payload;
      if (state.checkOutProducts[index]) {
        state.checkOutProducts[index].selectedQuantity = quantity;
      }
    },
    toggleProductOptions: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.products[index]) {
        state.products[index].isOptionsOpen =
          !state.products[index].isOptionsOpen;
      }
    },
    setCheckoutSource: (state, action: PayloadAction<"cart" | "buyNow">) => {
      state.checkoutSource = action.payload;
    },
    clearCheckoutSource: (state) => {
      state.checkoutSource = "cart";
    },
    processOrder: (state, action: PayloadAction<number | null>) => {
      state.pendingOrder = action.payload;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  updateProduct,
  emptyCart,
  addProductToCheckout,
  removeProductFromCheckout,
  clearCheckout,
  updateProductInCheckout,
  updateProductOptionsInCheckout,
  updateProductQuantityInCheckout,
  updateProductOptions,
  updateProductQuantity,
  toggleProductOptions,
  clearCheckoutSource,
  setCheckoutSource,
  processOrder,
} = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart;

const cartReducer = cartSlice.reducer;
export default cartReducer;
