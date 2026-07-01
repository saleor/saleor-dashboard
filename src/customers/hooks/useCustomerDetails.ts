import { CustomerDetailsContext } from "@dashboard/customers/providers/CustomerDetailsProvider";
import { useContext } from "react";

export const useCustomerDetails = () => {
  const customerDetails = useContext(CustomerDetailsContext);

  if (!customerDetails) {
    throw new Error("You are trying to use CustomerDetailsContext outside of its provider");
  }

  return customerDetails;
};
