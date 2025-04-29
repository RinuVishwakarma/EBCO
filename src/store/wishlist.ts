import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ProductDetails } from "@/interface/productDetails";

interface WishlistState {
  products: ProductDetails[];
}

const initialState: WishlistState = {
  products: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleProductInWishlist: (state, action: PayloadAction<ProductDetails>) => {
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
    removeProductFromWishlist: (state, action: PayloadAction<number>) => {
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

export const { toggleProductInWishlist, removeProductFromWishlist } =
  wishlistSlice.actions;

export const selectWishlist = (state: RootState) => state.wishlist;

const wishlistReducer = wishlistSlice.reducer;
export default wishlistReducer;

// Utility function to check if a product is in the wishlist
export const isProductInWishlist = (
  state: RootState,
  productId: number
): boolean => {
  // console.log(state.wishlist?.products, productId);
  return state.wishlist?.products?.some((product) => product.id === productId);
};
