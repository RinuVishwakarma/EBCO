// utils/wishlistUtils.ts
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { apiClient } from "@/apiClient/apiService";
import { useMutation } from "@tanstack/react-query";
// import { useMutation } from "react-query";
interface Data {
  product_id: number;
}
export const addBookmark = async (productId: number) => {
  try {
    const response = await apiClient.post<Data, number[]>(
      `${API_ENDPOINT.POST.handleBookmark}/add`,
      { product_id: productId }
    );
    return response;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const useAddBookmark = () => {
  return useMutation({
    mutationFn: addBookmark,
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
