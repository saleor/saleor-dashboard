import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import {
  TypedRemoveCustomerMutation,
  TypedUpdateCustomerMutation
} from "../mutations";
import { CustomerDetailsProvider } from "../providers/CustomerDetailsProvider";
import { RemoveCustomer } from "../types/RemoveCustomer";
import { UpdateCustomer } from "../types/UpdateCustomer";
import { customerListUrl, CustomerUrlQueryParams } from "../urls";
import { CustomerDetailsContent } from "./CustomerDetailsContent";

interface CustomerDetailsViewProps {
  id: string;
  params: CustomerUrlQueryParams;
}

export const CustomerDetailsView: React.FC<CustomerDetailsViewProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleCustomerUpdateSuccess = (data: UpdateCustomer) => {
    if (data.customerUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };
  const handleCustomerRemoveSuccess = (data: RemoveCustomer) => {
    if (data.customerDelete.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Customer Removed"
        })
      });
      navigate(customerListUrl());
    }
  };

  const handleBack = () => navigate(customerListUrl());

  return (
    <TypedRemoveCustomerMutation
      variables={{ id }}
      onCompleted={handleCustomerRemoveSuccess}
    >
      {(removeCustomer, removeCustomerOpts) => (
        <TypedUpdateCustomerMutation onCompleted={handleCustomerUpdateSuccess}>
          {(updateCustomer, updateCustomerOpts) => (
            <CustomerDetailsProvider id={id}>
              <CustomerDetailsContent
                handleBack={handleBack}
                id={id}
                navigate={navigate}
                params={params}
                removeCustomer={removeCustomer}
                removeCustomerOpts={removeCustomerOpts}
                updateCustomer={updateCustomer}
                updateCustomerOpts={updateCustomerOpts}
              />
            </CustomerDetailsProvider>
          )}
        </TypedUpdateCustomerMutation>
      )}
    </TypedRemoveCustomerMutation>
  );
};
export default CustomerDetailsView;
