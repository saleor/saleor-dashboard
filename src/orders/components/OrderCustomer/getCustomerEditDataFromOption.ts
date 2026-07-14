import { type OrderDetailsFragment } from "@dashboard/graphql";
import { type Option } from "@saleor/macaw-ui-next";

import { type CustomerEditData } from "./OrderCustomer";

export const getCustomerEditDataFromOption = (
  option: Option,
  currentUser: OrderDetailsFragment["user"] | null,
  currentUserEmail: string | null,
): CustomerEditData => {
  const value = String(option.value);

  return {
    prevUser: currentUser?.id,
    prevUserEmail: currentUserEmail || undefined,
    [value.includes("@") ? "userEmail" : "user"]: value,
  };
};
