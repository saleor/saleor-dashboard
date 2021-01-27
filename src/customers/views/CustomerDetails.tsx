import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../misc";
import { orderListUrl, orderUrl } from "../../orders/urls";
import CustomerDetailsPage, {
  CustomerDetailsPageFormData
} from "../components/CustomerDetailsPage/CustomerDetailsPage";
import {
  TypedRemoveCustomerMutation,
  TypedUpdateCustomerMutation
} from "../mutations";
import { TypedCustomerDetailsQuery } from "../queries";
import { RemoveCustomer } from "../types/RemoveCustomer";
import { UpdateCustomer } from "../types/UpdateCustomer";
import {
  customerAddressesUrl,
  customerListUrl,
  customerUrl,
  CustomerUrlQueryParams
} from "../urls";

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
            <TypedCustomerDetailsQuery displayLoader variables={{ id }}>
              {customerDetails => {
                const user = customerDetails.data?.user;

                if (user === null) {
                  return <NotFoundPage onBack={handleBack} />;
                }

                const handleSubmit = async (
                  data: CustomerDetailsPageFormData
                ) => {
                  const result = await updateCustomer({
                    variables: {
                      id,
                      input: {
                        email: data.email,
                        firstName: data.firstName,
                        isActive: data.isActive,
                        lastName: data.lastName,
                        note: data.note
                      }
                    }
                  });

                  return result.data.customerUpdate.errors;
                };

                return (
                  <>
                    <WindowTitle
                      title={maybe(() => customerDetails.data.user.email)}
                    />
                    <CustomerDetailsPage
                      customer={maybe(() => customerDetails.data.user)}
                      disabled={
                        customerDetails.loading ||
                        updateCustomerOpts.loading ||
                        removeCustomerOpts.loading
                      }
                      errors={
                        updateCustomerOpts.data?.customerUpdate.errors || []
                      }
                      saveButtonBar={updateCustomerOpts.status}
                      onAddressManageClick={() =>
                        navigate(customerAddressesUrl(id))
                      }
                      onBack={handleBack}
                      onRowClick={id => navigate(orderUrl(id))}
                      onSubmit={handleSubmit}
                      onDelete={() =>
                        navigate(
                          customerUrl(id, {
                            action: "remove"
                          })
                        )
                      }
                      onViewAllOrdersClick={() =>
                        navigate(
                          orderListUrl({
                            customer: maybe(
                              () => customerDetails.data.user.email
                            )
                          })
                        )
                      }
                    />
                    <ActionDialog
                      confirmButtonState={removeCustomerOpts.status}
                      onClose={() => navigate(customerUrl(id), true)}
                      onConfirm={() => removeCustomer()}
                      title={intl.formatMessage({
                        defaultMessage: "Delete Customer",
                        description: "dialog header"
                      })}
                      variant="delete"
                      open={params.action === "remove"}
                    >
                      <DialogContentText>
                        <FormattedMessage
                          defaultMessage="Are you sure you want to delete {email}?"
                          description="delete customer, dialog content"
                          values={{
                            email: (
                              <strong>
                                {maybe(
                                  () => customerDetails.data.user.email,
                                  "..."
                                )}
                              </strong>
                            )
                          }}
                        />
                      </DialogContentText>
                    </ActionDialog>
                  </>
                );
              }}
            </TypedCustomerDetailsQuery>
          )}
        </TypedUpdateCustomerMutation>
      )}
    </TypedRemoveCustomerMutation>
  );
};
export default CustomerDetailsView;
