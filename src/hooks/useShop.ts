import { useContext } from "react";

import { ShopContext } from "@saleor/components/Shop";

function useShop() {
  return useContext(ShopContext);
}
export default useShop;
