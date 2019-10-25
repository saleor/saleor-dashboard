import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe, transformFormToAddress } from "../../misc";
import CustomerAddressDialog from "../components/CustomerAddressDialog";
import CustomerAddressListPage from "../components/CustomerAddressListPage";
import {
  TypedCreateCustomerAddressMutation,
  TypedRemoveCustomerAddressMutation,
  TypedSetCustomerDefaultAddressMutation,
  TypedUpdateCustomerAddressMutation
} from "../mutations";
import { TypedCustomerAddressesQuery } from "../queries";
import { CreateCustomerAddress } from "../types/CreateCustomerAddress";
import { RemoveCustomerAddress } from "../types/RemoveCustomerAddress";
import { SetCustomerDefaultAddress } from "../types/SetCustomerDefaultAddress";
import { UpdateCustomerAddress } from "../types/UpdateCustomerAddress";
import {
  customerAddressesUrl,
  CustomerAddressesUrlDialog,
  CustomerAddressesUrlQueryParams,
  customerUrl
} from "../urls";

interface CustomerAddressesProps {
  id: string;
  params: CustomerAddressesUrlQueryParams;
}

const CustomerAddresses: React.FC<CustomerAddressesProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const closeModal = () => navigate(customerAddressesUrl(id), true);
  const openModal = (action: CustomerAddressesUrlDialog, addressId?: string) =>
    navigate(customerAddressesUrl(id, { action, id: addressId }));

  const handleSetAddressAsDefault = (data: SetCustomerDefaultAddress) => {
    if (data.addressSetDefault.errors.length === 0) {
      closeModal();
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  const handleAddressCreate = (data: CreateCustomerAddress) => {
    if (data.addressCreate.errors.length === 0) {
      closeModal();
    }
  };

  const handleAddressUpdate = (data: UpdateCustomerAddress) => {
    if (data.addressUpdate.errors.length === 0) {
      closeModal();
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  const handleAddressRemove = (data: RemoveCustomerAddress) => {
    if (data.addressDelete.errors.length === 0) {
      closeModal();
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  return (
    <TypedSetCustomerDefaultAddressMutation
      onCompleted={handleSetAddressAsDefault}
    >
      {setCustomerDefaultAddress => (
        <TypedCreateCustomerAddressMutation onCompleted={handleAddressCreate}>
          {(createCustomerAddress, createCustomerAddressOpts) => (
            <TypedUpdateCustomerAddressMutation
              onCompleted={handleAddressUpdate}
            >
              {(updateCustomerAddress, updateCustomerAddressOpts) => (
                <TypedRemoveCustomerAddressMutation
                  onCompleted={handleAddressRemove}
                >
                  {(removeCustomerAddress, removeCustomerAddressOpts) => (
                    <TypedCustomerAddressesQuery variables={{ id }}>
                      {customerData => {
                        const createAddressTransitionState = getMutationState(
                          createCustomerAddressOpts.called,
                          createCustomerAddressOpts.loading,
                          maybe(
                            () =>
                              createCustomerAddressOpts.data.addressCreate
                                .errors,
                            []
                          )
                        );

                        const updateAddressTransitionState = getMutationState(
                          updateCustomerAddressOpts.called,
                          updateCustomerAddressOpts.loading,
                          maybe(
                            () =>
                              updateCustomerAddressOpts.data.addressUpdate
                                .errors,
                            []
                          )
                        );

                        const removeAddressTransitionState = getMutationState(
                          removeCustomerAddressOpts.called,
                          removeCustomerAddressOpts.loading,
                          maybe(
                            () =>
                              removeCustomerAddressOpts.data.addressDelete
                                .errors,
                            []
                          )
                        );

                        const countryChoices = maybe(
                          () =>
                            shop.countries.map(country => ({
                              code: country.code,
                              label: country.country
                            })),
                          []
                        );

                        return (
                          <>
                            <WindowTitle
                              title={maybe(() => customerData.data.user.email)}
                            />
                            <CustomerAddressListPage
                              customer={maybe(() => customerData.data.user)}
                              disabled={customerData.loading}
                              onAdd={() => openModal("add")}
                              onBack={() => navigate(customerUrl(id))}
                              onEdit={addressId => openModal("edit", addressId)}
                              onRemove={addressId =>
                                openModal("remove", addressId)
                              }
                              onSetAsDefault={(addressId, type) =>
                                setCustomerDefaultAddress({
                                  variables: { addressId, type, userId: id }
                                })
                              }
                            />
                            <CustomerAddressDialog
                              address={undefined}
                              confirmButtonState={createAddressTransitionState}
                              countries={countryChoices}
                              errors={maybe(
                                () =>
                                  createCustomerAddressOpts.data.addressCreate
                                    .errors,
                                []
                              )}
                              open={params.action === "add"}
                              variant="create"
                              onClose={closeModal}
                              onConfirm={input =>
                                createCustomerAddress({
                                  variables: {
                                    id,
                                    input: transformFormToAddress(input)
                                  }
                                })
                              }
                            />
                            <CustomerAddressDialog
                              address={maybe(() =>
                                customerData.data.user.addresses.find(
                                  addr => addr.id === params.id
                                )
                              )}
                              confirmButtonState={updateAddressTransitionState}
                              countries={countryChoices}
                              errors={maybe(
                                () =>
                                  updateCustomerAddressOpts.data.addressUpdate
                                    .errors,
                                []
                              )}
                              open={params.action === "edit"}
                              variant="edit"
                              onClose={closeModal}
                              onConfirm={input =>
                                updateCustomerAddress({
                                  variables: {
                                    id: params.id,
                                    input: transformFormToAddress(input)
                                  }
                                })
                              }
                            />
                            <ActionDialog
                              open={params.action === "remove"}
                              variant="delete"
                              title={intl.formatMessage({
                                defaultMessage: "Delete Address",
                                description: "dialog header"
                              })}
                              confirmButtonState={removeAddressTransitionState}
                              onClose={closeModal}
                              onConfirm={() =>
                                removeCustomerAddress({
                                  variables: {
                                    id: params.id
                                  }
                                })
                              }
                            >
                              <DialogContentText>
                                <FormattedMessage defaultMessage="Are you sure you want to delete this address from users address book?" />
                              </DialogContentText>
                            </ActionDialog>
                          </>
                        );
                      }}
                    </TypedCustomerAddressesQuery>
                  )}
                </TypedRemoveCustomerAddressMutation>
              )}
            </TypedUpdateCustomerAddressMutation>
          )}
        </TypedCreateCustomerAddressMutation>
      )}
    </TypedSetCustomerDefaultAddressMutation>
  );
};
export default CustomerAddresses;
