import { AppDispatch, RootState } from "@/store/store";
import { ProductDetails } from "@/interface/productDetails";
import { toggleProductInWishlist, isProductInWishlist } from "@/store/wishlist";


export const toggleProductInWishlistWithResult = (
  dispatch: AppDispatch,
  getState: () => RootState,
  product: ProductDetails
): boolean => {
  const state = getState();
  const isInWishlist = isProductInWishlist(state, product.id);

  dispatch(toggleProductInWishlist(product));

  return !isInWishlist;
};