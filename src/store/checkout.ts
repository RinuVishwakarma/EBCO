import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ProductDetails } from "@/interface/productDetails";
// import { checkoutSlice } from './checkout'; // Import the checkout slice

// Define the initial state type
interface checkoutState {
  products: ProductDetails[];
}

// Define the initial state
const initialState: checkoutState = {
  products: [],
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    addProductcheckout: (state, action: PayloadAction<ProductDetails>) => {
      const newProduct = action.payload;
      const existingProduct = state.products.find(
        p => p.id === newProduct.id && p.selectedSize === newProduct.selectedSize && p.selectedColor === newProduct.selectedColor
      );

      let updatedQuantity = newProduct.selectedQuantity;

      if (existingProduct && updatedQuantity) {
        // If the product exists, get its current quantity and remove it from the state

        updatedQuantity += existingProduct?.selectedQuantity!;
        state.products = state.products.filter(
          product => !(product.id === newProduct.id && product.selectedSize === newProduct.selectedSize && product.selectedColor === newProduct.selectedColor)
        );
      }

      // Add the new product with the updated quantity
      state.products.push({ ...newProduct, selectedQuantity: updatedQuantity, isEdit: false });

    },
    removeProductcheckout: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        product => product.name !== action.payload
      );
    },
    updateProductcheckout: (state, action: PayloadAction<ProductDetails>) => {
      const index = state.products.findIndex(
        product => product.name === action.payload.name
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    updateProductSizecheckout: (state, action: PayloadAction<{ id: number; selectedSize: string }>) => {
      const { id, selectedSize } = action.payload;
      const product = state.products.find((p, index) => index === id);
      if (product) {
        product.selectedSize = selectedSize;
      }
    },
    updateProductColorcheckout: (state, action: PayloadAction<{ id: number; selectedColor: string }>) => {
      const { id, selectedColor } = action.payload;
      const product = state.products.find((p, index) => index === id);
      if (product) {
        product.selectedColor = selectedColor;
      }
    },
    updateProductQuantitycheckout: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p, index) => index === id);
      if (product) {
        product.selectedQuantity = quantity;
      }
    },
    clearCartcheckout: (state) => {
      state.products = [];
    },

  },
});

// Export the actions
export const { addProductcheckout, removeProductcheckout, updateProductcheckout, clearCartcheckout, updateProductColorcheckout, updateProductQuantitycheckout, updateProductSizecheckout } = checkoutSlice.actions;

// Export the selector
export const selectCheckout = (state: RootState) => state.cart;

// Export the reducer
const checkoutReducer = checkoutSlice.reducer;
export default checkoutReducer;
