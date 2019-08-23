import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { maybe } from "../../misc";
import CustomerCreatePage from "../components/CustomerCreatePage";
import { TypedCreateCustomerMutation } from "../mutations";
import { TypedCustomerCreateDataQuery } from "../queries";
import { CreateCustomer } from "../types/CreateCustomer";
import { customerListUrl, customerUrl } from "../urls";

export const CustomerCreate: React.StatelessComponent<{}> = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleCreateCustomerSuccess = (data: CreateCustomer) => {
    if (data.customerCreate.errors.length === 0) {
      notify({
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
                errors={maybe(() => {
                  const errs = createCustomerOpts.data.customerCreate.errors;
                  return errs.map(err =>
                    err.field.split(":").length > 1
                      ? {
                          ...err,
                          field: err.field.split(":")[1]
                        }
                      : err
                  );
                }, [])}
                saveButtonBar={
                  createCustomerOpts.loading ? "loading" : "default"
                }
                onBack={() => navigate(customerListUrl())}
                onSubmit={formData => {
                  const address = {
                    city: formData.city,
                    cityArea: formData.cityArea,
                    companyName: formData.companyName,
                    country: formData.country,
                    countryArea: formData.countryArea,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    postalCode: formData.postalCode,
                    streetAddress1: formData.streetAddress1,
                    streetAddress2: formData.streetAddress2
                  };
                  createCustomer({
                    variables: {
                      input: {
                        defaultBillingAddress: address,
                        defaultShippingAddress: address,
                        email: formData.email,
                        firstName: formData.customerFirstName,
                        lastName: formData.customerLastName,
                        note: formData.note,
                        sendPasswordEmail: true
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
