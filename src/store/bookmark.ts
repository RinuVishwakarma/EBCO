import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ProductDetails } from "@/interface/productDetails";

interface BookmarkState {
  products: ProductDetails[];
}

const initialState: BookmarkState = {
  products: [],
};

export const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    toggleProductInBookmark: (state, action: PayloadAction<ProductDetails>) => {
      const product = action.payload;
      const existingProductIndex = state.products.findIndex(
        (p) => p.id === product.id
      );

      if (existingProductIndex !== -1) {
        // Product exists, remove it
        state.products.splice(existingProductIndex, 1);
      } else {
        // Product does not exist, add it
        state.products.push(product);
      }
    },
    removeProductFromBookmark: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const existingProductIndex = state.products.findIndex(
        (p) => p.id === productId
      );

      if (existingProductIndex !== -1) {
        state.products.splice(existingProductIndex, 1);
      }
    },
  },
});

export const { toggleProductInBookmark, removeProductFromBookmark } =
  bookmarkSlice.actions;

export const selectBookmark = (state: RootState) => state.bookmark;

const bookmarkReducer = bookmarkSlice.reducer;
export default bookmarkReducer;

// Utility function to check if a product is in the bookmark
export const isProductInBookmark = (
  state: RootState,
  productId: number
): boolean => {
  // console.log(state.bookmark?.products, productId);
  return state.bookmark?.products?.some((product) => product.id === productId);
};
