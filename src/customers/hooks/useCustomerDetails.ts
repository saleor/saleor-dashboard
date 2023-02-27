import { CustomerDetailsContext } from "@dashboard/customers/providers/CustomerDetailsProvider";
import { useContext } from "react";

export const useCustomerDetails = () => {
  const customerDetails = useContext(CustomerDetailsContext);

  return customerDetails;
};
