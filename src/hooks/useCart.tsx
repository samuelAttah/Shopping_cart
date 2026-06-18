import { useContext } from "react";
import CartContext from "../context/CartProvider";
import type { CartContextType } from "../context/CartProvider";

const useCart = (): CartContextType => {
  return useContext(CartContext);
};

export default useCart;
