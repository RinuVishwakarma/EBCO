"use client";
import Product from "../module-components/Product/Product";

interface typeInterface {
  type: string;
}
const ProductPageContainer = ({ type }: typeInterface) => {


  return <Product type={type} />;
};

export default ProductPageContainer;
