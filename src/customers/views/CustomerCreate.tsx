import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import { maybe } from "../../misc";
import CustomerCreatePage from "../components/CustomerCreatePage";
import { TypedCreateCustomerMutation } from "../mutations";
import { TypedCustomerCreateDataQuery } from "../queries";
import { CreateCustomer } from "../types/CreateCustomer";
import { customerListUrl, customerUrl } from "../urls";

export const CustomerCreate: React.FC<{}> = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleCreateCustomerSuccess = (data: CreateCustomer) => {
    if (data.customerCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Customer created"
        })
      });
      navigate(customerUrl(data.customerCreate.user.id));
    }
  };
  return (
    <TypedCustomerCreateDataQuery displayLoader>
      {({ data, loading }) => (
        <TypedCreateCustomerMutation onCompleted={handleCreateCustomerSuccess}>
          {(createCustomer, createCustomerOpts) => (
            <>
              <WindowTitle
                title={intl.formatMessage({
                  defaultMessage: "Create customer",
                  description: "window title"
                })}
              />
              <CustomerCreatePage
                countries={maybe(() => data.shop.countries, [])}
                disabled={loading || createCustomerOpts.loading}
                errors={createCustomerOpts.data?.customerCreate.errors || []}
                saveButtonBar={createCustomerOpts.status}
                onBack={() => navigate(customerListUrl())}
                onSubmit={formData => {
                  createCustomer({
                    variables: {
                      input: {
                        defaultBillingAddress: formData.address,
                        defaultShippingAddress: formData.address,
                        email: formData.email,
                        firstName: formData.customerFirstName,
                        lastName: formData.customerLastName,
                        note: formData.note
                      }
                    }
                  });
                }}
              />
            </>
          )}
        </TypedCreateCustomerMutation>
      )}
    </TypedCustomerCreateDataQuery>
  );
};
export default CustomerCreate;
