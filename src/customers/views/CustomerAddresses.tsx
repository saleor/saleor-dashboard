import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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

  const [openModal, closeModal] = createDialogActionHandlers<
    CustomerAddressesUrlDialog,
    CustomerAddressesUrlQueryParams
  >(navigate, params => customerAddressesUrl(id, params), params);

  const handleSetAddressAsDefault = (data: SetCustomerDefaultAddress) => {
    if (data.addressSetDefault.errors.length === 0) {
      closeModal();
      notify({
        status: "success",
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
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  const handleAddressRemove = (data: RemoveCustomerAddress) => {
    if (data.addressDelete.errors.length === 0) {
      closeModal();
      notify({
        status: "success",
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
                        const countryChoices = shop?.countries || [];

                        return (
                          <>
                            <WindowTitle
                              title={customerData?.data?.user.email}
                            />
                            <CustomerAddressListPage
                              customer={customerData?.data?.user}
                              disabled={customerData?.loading}
                              onAdd={() => openModal("add")}
                              onBack={() => navigate(customerUrl(id))}
                              onEdit={id =>
                                openModal("edit", {
                                  id
                                })
                              }
                              onRemove={id =>
                                openModal("remove", {
                                  id
                                })
                              }
                              onSetAsDefault={(addressId, type) =>
                                setCustomerDefaultAddress({
                                  variables: { addressId, type, userId: id }
                                })
                              }
                            />
                            <CustomerAddressDialog
                              address={undefined}
                              confirmButtonState={
                                createCustomerAddressOpts.status
                              }
                              countries={countryChoices}
                              errors={
                                createCustomerAddressOpts?.data?.addressCreate
                                  .errors || []
                              }
                              open={params.action === "add"}
                              variant="create"
                              onClose={closeModal}
                              onConfirm={input =>
                                createCustomerAddress({
                                  variables: {
                                    id,
                                    input
                                  }
                                })
                              }
                            />
                            <CustomerAddressDialog
                              address={customerData?.data?.user.addresses.find(
                                addr => addr.id === params.id
                              )}
                              confirmButtonState={
                                updateCustomerAddressOpts.status
                              }
                              countries={countryChoices}
                              errors={
                                updateCustomerAddressOpts?.data?.addressUpdate
                                  .errors || []
                              }
                              open={params.action === "edit"}
                              variant="edit"
                              onClose={closeModal}
                              onConfirm={input =>
                                updateCustomerAddress({
                                  variables: {
                                    id: params.id,
                                    input
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
                              confirmButtonState={
                                removeCustomerAddressOpts.status
                              }
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
