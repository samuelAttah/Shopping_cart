import { useContext } from "react";
import ProductsContext from "../context/ProductsProvider";
import type { ProductsContextType } from "../context/ProductsProvider";

const useProducts = (): ProductsContextType => {
  return useContext(ProductsContext);
};

export default useProducts;
