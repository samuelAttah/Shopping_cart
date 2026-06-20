import React from "react";
import type { ReactNode } from "react";
import type { CartItemType, ReducerAction } from "../context/CartProvider";

type CartLineItemProps = {
  item: CartItemType;
  dispatch: React.ActionDispatch<[action: ReducerAction]>;
};
const CartLineItem = ({ item, dispatch }: CartLineItemProps) => {
  const img: string = new URL(`../images/${item.sku}.jpg`, import.meta.url)
    .href;

  const lineTotal: number = item.quantity * item.price;

  const highestQty: number = 20 > item.quantity ? 20 : item.quantity;

  const optionsValue: number[] = Array.from(
    { length: highestQty },
    (_, i) => i + 1,
  );

  const options: ReactNode = optionsValue.map((val) => (
    <option key={`opt${val}`} value={val}>
      {val}
    </option>
  ));

  const onChangeQuantity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { ...item, quantity: Number(e.target.value) },
    });
  };

  const onRemoveItem = () => {
    dispatch({ type: "REMOVE", payload: item });
  };

  const content = (
    <li className="cart__item">
      <img src={img} alt={item.name} className="cart__img" />
      <div aria-label="Item name">{item.name}</div>
      <div aria-label="Price Per Item ">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.price)}
      </div>

      <label htmlFor="itemQuantity" className="offscreen">
        {" "}
        Item Quantity
      </label>
      <select
        name="itemQuantity"
        id="itemQuantity"
        className="cart__select"
        value={item.quantity}
        onChange={onChangeQuantity}
      >
        {options}
      </select>
      <div className="cart__item-subtotal" aria-label="Line Item Subtotal">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(lineTotal)}
      </div>

      <button
        className="cart__button"
        aria-label="Remove item From Cart"
        title="Remove item From Cart"
        onClick={onRemoveItem}
      >
        ❌
      </button>
    </li>
  );

  return content;
};

function areItemsEqual(
  { item: prevItem }: CartLineItemProps,
  { item: currentItem }: CartLineItemProps,
): boolean {
  // return (
  //   prevItem.sku === currentItem.sku &&
  //   prevItem.price === currentItem.price &&
  //   prevItem.quantity === currentItem.quantity
  // );
  return Object.keys(prevItem).every(
    (key) =>
      prevItem[key as keyof CartItemType] ===
      currentItem[key as keyof CartItemType],
  );
}

const MemoizedCartLineItem = React.memo(CartLineItem, areItemsEqual);

export default MemoizedCartLineItem;
