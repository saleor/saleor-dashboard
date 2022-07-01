import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  useCreateCustomerMutation,
  useCustomerCreateDataQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import { extractMutationErrors, maybe } from "../../misc";
import CustomerCreatePage, {
  CustomerCreatePageSubmitData,
} from "../components/CustomerCreatePage";
import { customerUrl } from "../urls";

export const CustomerCreate: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading } = useCustomerCreateDataQuery({
    displayLoader: true,
  });

  const [createCustomer, createCustomerOpts] = useCreateCustomerMutation({
    onCompleted: data => {
      if (data.customerCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "ftcHpD",
            defaultMessage: "Customer created",
          }),
        });
        navigate(customerUrl(data.customerCreate.user.id));
      }
    },
  });

  const handleSubmit = (formData: CustomerCreatePageSubmitData) =>
    extractMutationErrors(
      createCustomer({
        variables: {
          input: {
            defaultBillingAddress: formData.address,
            defaultShippingAddress: formData.address,
            email: formData.email,
            firstName: formData.customerFirstName,
            lastName: formData.customerLastName,
            note: formData.note,
          },
        },
      }),
    );

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "nX2pCU",
          defaultMessage: "Create customer",
          description: "window title",
        })}
      />
      <CustomerCreatePage
        countries={maybe(() => data.shop.countries, [])}
        disabled={loading || createCustomerOpts.loading}
        errors={createCustomerOpts.data?.customerCreate.errors || []}
        saveButtonBar={createCustomerOpts.status}
        onSubmit={handleSubmit}
      />
    </>
  );
};
export default CustomerCreate;
