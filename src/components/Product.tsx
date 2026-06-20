import React, { type ReactNode } from "react";
import type { ProductType } from "../context/ProductsProvider";
import type { ReducerAction } from "../context/CartProvider";

type ProductProps = {
  product: ProductType;
  inCart: boolean;
  dispatch: React.ActionDispatch<[action: ReducerAction]>;
};

const Product = ({ product, inCart, dispatch }: ProductProps): ReactNode => {
  const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url)
    .href;

  const onAddToCart = () => {
    dispatch({ type: "ADD", payload: { ...product, quantity: 0 } });
  };

  const itemInCart = inCart ? "-> Item in Cart: ✔️" : null;

  const content = (
    <article className="product">
      <h3>{product.name}</h3>
      <img src={img} alt={product.name} className="product__img" />
      <p>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}{" "}
        {itemInCart}
      </p>
      <button onClick={onAddToCart}> Add To Cart</button>
    </article>
  );

  return content;
};

function areProductsEqual(
  { product: prevProduct, inCart: prevInCart }: ProductProps,
  { product: currentProduct, inCart: currentInCart }: ProductProps,
): boolean {
  return (
    Object.keys(prevProduct).every(
      (key) =>
        prevProduct[key as keyof ProductType] ===
        currentProduct[key as keyof ProductType],
    ) && prevInCart === currentInCart
  );
}

const MemoizedProduct = React.memo<typeof Product>(Product, areProductsEqual);

export default MemoizedProduct;
