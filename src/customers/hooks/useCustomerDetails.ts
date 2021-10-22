import { CustomerDetailsContext } from "@saleor/customers/providers/CustomerDetailsProvider";
import { useContext } from "react";

export const useCustomerDetails = () => {
  const customerDetails = useContext(CustomerDetailsContext);

  return customerDetails;
};
