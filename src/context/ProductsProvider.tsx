import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type ProductType = {
  sku: string;
  name: string;
  price: number;
};

const initProductsState: ProductType[] = [];
// const initProductsState: ProductType[] = [
//   {
//     sku: "item0001",
//     name: "Widget",
//     price: 9.99,
//   },
//   {
//     sku: "item0002",
//     name: "Premium Widget",
//     price: 19.99,
//   },
//   {
//     sku: "item0003",
//     name: "Deluxe Widget",
//     price: 29.99,
//   },
// ];

export type ProductsContextType = {
  products: ProductType[];
};

const initContextState: ProductsContextType = {
  products: [],
};

const ProductsContext = createContext<ProductsContextType>(initContextState);

type ProductsChildrenType = {
  children?: ReactNode;
};

export const ProductsProvider = ({
  children,
}: ProductsChildrenType): ReactNode => {
  const [products, setProducts] = useState<ProductType[]>(initProductsState);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: ProductType[] = await response.json();
        setProducts(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
