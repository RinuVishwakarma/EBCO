// utils/wishlistUtils.ts
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { apiClient } from "@/apiClient/apiService";
import { useMutation } from "@tanstack/react-query";
// import { useMutation } from "react-query";
interface Data {
  product_id: number;
}
export const removeWishlist = async (productId: number) => {
  try {
    const response = await apiClient.post<Data, number[]>(
      `${API_ENDPOINT.POST.handleWishlist}/remove`,
      { product_id: productId }
    );
    return response;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

// export const useRemoveWishlist = () => {
//   return useMutation({
//     mutationFn: removeWishlist,
//     onSuccess: async (data) => {
//       // Handle success, e.g., store the token, navigate to another page, etc.
//       document.body.classList.remove("loading");
//       //console.log(data);
//     },
//     onError: (error) => {
//       // Handle error, e.g., show an error message to the user
//       console.error("Error fetching token:", error);
//     },
//   });
// };
export const useRemoveWishlist = () => {
  return useMutation({
    mutationFn: removeWishlist,
    onSuccess: async (data) => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove("loading");
      //console.log(data);
    },
    onError: (error) => {
      // Handle error, e.g., show an error message to the user
      console.error("Error fetching token:", error);
    },
  });
};
