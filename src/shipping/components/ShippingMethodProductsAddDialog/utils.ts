import { Products } from "./types";

export const isProductSelected = (selectedProducts: Products, productId?: string) => {
  if (!productId) return false;

  return selectedProducts.some(selectedProduct => selectedProduct.id === productId);
};
