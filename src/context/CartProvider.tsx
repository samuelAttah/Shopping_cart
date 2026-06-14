import { createContext, useReducer, useMemo } from "react";
import type { ReactNode } from "react";

export type CartItemType = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

type CartStateType = {
  cart: CartItemType[];
};

const initCartState: CartStateType = {
  cart: [],
};

const REDUCER_ACTION_TYPE = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  SUBMIT: "SUBMIT",
} as const;

export type ReducerActionType =
  (typeof REDUCER_ACTION_TYPE)[keyof typeof REDUCER_ACTION_TYPE];

export type ReducerAction = {
  type: ReducerActionType;
  payload?: CartItemType;
};

const reducer = (
  state: CartStateType,
  action: ReducerAction,
): CartStateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD:
      if (!action.payload) {
        throw new Error("Payload is required for ADD action");
      } else {
        const { sku, name, price } = action.payload;

        const existingCartItems: CartItemType[] = state.cart.filter(
          (item) => item.sku !== sku,
        );

        const itemExists: CartItemType | undefined = state.cart.find(
          (item) => item.sku === sku,
        );

        const updatedItem: CartItemType = itemExists
          ? { ...itemExists, quantity: itemExists.quantity + 1 }
          : { sku, name, price, quantity: 1 };
        return { ...state, cart: [...existingCartItems, updatedItem] };
      }

    // return { ...state, cart: [...state.cart, action.payload] };
    case REDUCER_ACTION_TYPE.REMOVE:
      if (!action.payload) {
        throw new Error("Payload is required for REMOVE action");
      }
      return {
        ...state,
        cart: state.cart.filter((item) => item.sku !== action?.payload?.sku),
      };
    case REDUCER_ACTION_TYPE.UPDATE_QUANTITY:
      if (!action.payload) {
        throw new Error("Payload is required for UPDATE_QUANTITY action");
      } else {
        const { sku, quantity } = action.payload;

        const itemExists: CartItemType | undefined = state.cart.find(
          (item) => item.sku === sku,
        );

        if (!itemExists) {
          throw new Error("Item does not exist in the cart");
        }
        const updatedItem: CartItemType = { ...itemExists, quantity: quantity };

        const existingCartItems: CartItemType[] = state.cart.filter(
          (item) => item.sku !== sku,
        );

        return { ...state, cart: [...existingCartItems, updatedItem] };
      }

    case REDUCER_ACTION_TYPE.SUBMIT:
      return { ...state, cart: [] };
    default:
      throw new Error("Unidentified reducer action type");
  }
};

const useCartContext = (initCartState: CartStateType) => {
  const [state, dispatch] = useReducer(reducer, initCartState);

  const REDUCER_ACTIONS = useMemo(() => REDUCER_ACTION_TYPE, []);

  const totalItems: number = state.cart.reduce((previousValue, currentItem) => {
    return previousValue + currentItem.quantity;
  }, 0);

  const totalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    state.cart.reduce((previousValue, currentItem) => {
      return previousValue + currentItem.price * currentItem.quantity;
    }, 0),
  );

  const sortedCart = state.cart.sort((a, b) => {
    const itemA = Number(a.sku.slice(-4));
    const itemB = Number(b.sku.slice(-4));
    return itemA - itemB;
  });

  return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, sortedCart };
};

export type CartContextType = ReturnType<typeof useCartContext>;

const initCartContextState: CartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
  totalItems: 0,
  totalPrice: "",
  sortedCart: [],
};

const CartContext = createContext<CartContextType>(initCartContextState);

type CartChildrenType = {
  children?: ReactNode;
};

export const CartProvider = ({ children }: CartChildrenType): ReactNode => {
  return (
    <CartContext.Provider value={useCartContext(initCartState)}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
