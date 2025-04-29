"use client";
import SearchProduct from "../module-components/SearchProduct/SearchProduct";
interface typeInterface {
  type: string;
}
const SearchProductContainer = ({ type }: typeInterface) => {


  return <SearchProduct />;
};

export default SearchProductContainer;
