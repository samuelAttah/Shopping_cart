import type { ReactNode } from "react";
import useCart from "../hooks/useCart";
import useProducts from "../hooks/useProducts";
// import type { ProductsContextType } from "../context/ProductsProvider";
import Product from "./Product";

const ProductList = () => {
  const { products } = useProducts();
  const { dispatch, sortedCart } = useCart();

  let pageContent: ReactNode = <p>Loading...</p>;
  if (products?.length) {
    pageContent = products.map((product) => {
      const inCart: boolean = sortedCart.some(
        (item) => item.sku === product.sku,
      );
      return (
        <Product
          key={product.sku}
          product={product}
          inCart={inCart}
          dispatch={dispatch}
        />
      );
    });
  }

  const content = <main className="main main--products">{pageContent}</main>;

  return content;
};

export default ProductList;
