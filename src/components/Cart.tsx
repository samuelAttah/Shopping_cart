import { useState } from "react";
import useCart from "../hooks/useCart";
import CartLineItem from "./CartLineItem";

const Cart = () => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const { sortedCart, totalItems, totalPrice, dispatch } = useCart();

  const onSubmitOrder = () => {
    dispatch({ type: "SUBMIT" });
    setConfirm(true);
  };

  const pageContent = confirm ? (
    <h2>Thank you for your order!</h2>
  ) : (
    <>
      <h2 className="offscreen">Cart</h2>
      <ul className="cart">
        {sortedCart.map((item) => (
          <CartLineItem key={item.sku} item={item} dispatch={dispatch} />
        ))}
      </ul>
      <div className="cart__totals">
        <p>Total Items: {totalItems}</p>
        <p>Total Price: {totalPrice}</p>
        <button
          className="cart__submit"
          disabled={!totalItems}
          onClick={onSubmitOrder}
        >
          Place Order
        </button>
      </div>
    </>
  );

  const content = <main className="main main--cart">{pageContent}</main>;

  return content;
};

export default Cart;
