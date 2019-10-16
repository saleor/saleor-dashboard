import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "../../misc";
import { orderListUrl, orderUrl } from "../../orders/urls";
import CustomerDetailsPage from "../components/CustomerDetailsPage/CustomerDetailsPage";
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

export const CustomerDetailsView: React.StatelessComponent<
  CustomerDetailsViewProps
> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleCustomerUpdateSuccess = (data: UpdateCustomer) => {
    if (data.customerUpdate.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };
  const handleCustomerRemoveSuccess = (data: RemoveCustomer) => {
    if (data.customerDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Customer Removed"
        })
      });
      navigate(customerListUrl());
    }
  };
  return (
    <TypedRemoveCustomerMutation
      variables={{ id }}
      onCompleted={handleCustomerRemoveSuccess}
    >
      {(removeCustomer, removeCustomerOpts) => (
        <TypedUpdateCustomerMutation onCompleted={handleCustomerUpdateSuccess}>
          {(updateCustomer, updateCustomerOpts) => (
            <TypedCustomerDetailsQuery
              displayLoader
              variables={{ id }}
              require={["user"]}
            >
              {customerDetails => {
                const formTransitionState = getMutationState(
                  updateCustomerOpts.called,
                  updateCustomerOpts.loading,
                  maybe(() => updateCustomerOpts.data.customerUpdate.errors)
                );
                const removeTransitionState = getMutationState(
                  removeCustomerOpts.called,
                  removeCustomerOpts.loading,
                  maybe(() => removeCustomerOpts.data.customerDelete.errors)
                );

                return (
                  <>
                    <WindowTitle
                      title={maybe(() => customerDetails.data.user.email)}
                    />
                    <CustomerDetailsPage
                      customer={customerDetails.data.user}
                      disabled={
                        customerDetails.loading ||
                        updateCustomerOpts.loading ||
                        removeCustomerOpts.loading
                      }
                      errors={maybe(
                        () => updateCustomerOpts.data.customerUpdate.errors
                      )}
                      saveButtonBar={formTransitionState}
                      onAddressManageClick={() =>
                        navigate(customerAddressesUrl(id))
                      }
                      onBack={() => navigate(customerListUrl())}
                      onRowClick={id => navigate(orderUrl(id))}
                      onSubmit={formData =>
                        updateCustomer({
                          variables: {
                            id,
                            input: {
                              email: formData.email,
                              firstName: formData.firstName,
                              isActive: formData.isActive,
                              lastName: formData.lastName,
                              note: formData.note
                            }
                          }
                        })
                      }
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
                            email: maybe(() => customerDetails.data.user.email)
                          })
                        )
                      }
                    />
                    <ActionDialog
                      confirmButtonState={removeTransitionState}
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
