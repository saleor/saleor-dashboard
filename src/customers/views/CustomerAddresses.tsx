// @ts-strict-ignore
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useCreateCustomerAddressMutation,
  useCustomerAddressesQuery,
  useRemoveCustomerAddressMutation,
  useSetCustomerDefaultAddressMutation,
  useUpdateCustomerAddressMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import commonErrorMessages from "@dashboard/utils/errors/common";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useIntl } from "react-intl";

import { CustomerAddressDeleteDialog } from "../components/CustomerAddressDeleteDialog/CustomerAddressDeleteDialog";
import { CustomerAddressDialog } from "../components/CustomerAddressDialog/CustomerAddressDialog";
import CustomerAddressListPage from "../components/CustomerAddressListPage";
import {
  customerAddressesUrl,
  type CustomerAddressesUrlDialog,
  type CustomerAddressesUrlQueryParams,
} from "../urls";

interface CustomerAddressesProps {
  id: string;
  params: CustomerAddressesUrlQueryParams;
}

const CustomerAddresses = ({ id, params }: CustomerAddressesProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const [openModal, closeModal] = createDialogActionHandlers<
    CustomerAddressesUrlDialog,
    CustomerAddressesUrlQueryParams
  >(navigate, params => customerAddressesUrl(id, params), params);

  const [setCustomerDefaultAddress] = useSetCustomerDefaultAddressMutation({
    onCompleted: data => {
      if (data.addressSetDefault.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({ id: "bIAY+o", defaultMessage: "Address updated" }),
        });
      }
    },
  });

  // The address dialog already surfaces backend validation errors inline (the
  // `AccountErrorFragment` list is forwarded to `AddressEdit`, which renders
  // them as `helperText` under each affected field). We opt out of the global
  // "one error toast per nested mutation error" behavior in `makeMutation.ts`
  // so users don't see redundant "This field is required" toasts on top of
  // the highlighted fields.
  const [createCustomerAddress, createCustomerAddressOpts] = useCreateCustomerAddressMutation({
    disableErrorHandling: true,
    onCompleted: data => {
      if (data.addressCreate.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "sWvBZa",
            defaultMessage: "Address created",
          }),
        });
      }
    },
  });

  const [updateCustomerAddress, updateCustomerAddressOpts] = useUpdateCustomerAddressMutation({
    disableErrorHandling: true,
    onCompleted: data => {
      if (data.addressUpdate.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({ id: "bIAY+o", defaultMessage: "Address updated" }),
        });
      }
    },
  });

  const [removeCustomerAddress, removeCustomerAddressOpts] = useRemoveCustomerAddressMutation({
    onCompleted: data => {
      const errors = data.addressDelete.errors;

      if (errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "C7n+ew",
            defaultMessage: "Address deleted",
            description: "address removed from a customer's address book, success toast",
          }),
        });

        return;
      }

      notify({
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError),
      });
    },
  });

  const customerData = useCustomerAddressesQuery({
    displayLoader: true,
    variables: {
      id,
    },
  });

  const countryChoices = shop?.countries || [];

  return (
    <>
      <WindowTitle title={customerData?.data?.user.email} />
      <CustomerAddressListPage
        customer={customerData?.data?.user}
        disabled={customerData?.loading}
        onAdd={() => openModal("add")}
        onEdit={id =>
          openModal("edit", {
            id,
          })
        }
        onRemove={id =>
          openModal("remove", {
            id,
          })
        }
        onSetAsDefault={(addressId, type) =>
          setCustomerDefaultAddress({
            variables: { addressId, type, userId: id },
          })
        }
      />
      <CustomerAddressDialog
        confirmButtonState={createCustomerAddressOpts.status}
        countries={countryChoices}
        errors={createCustomerAddressOpts?.data?.addressCreate.errors || []}
        open={params.action === "add"}
        variant="create"
        onClose={closeModal}
        onConfirm={input =>
          createCustomerAddress({
            variables: {
              id,
              input,
            },
          })
        }
      />
      <CustomerAddressDialog
        address={customerData?.data?.user.addresses.find(addr => addr.id === params.id)}
        confirmButtonState={updateCustomerAddressOpts.status}
        countries={countryChoices}
        errors={updateCustomerAddressOpts?.data?.addressUpdate.errors || []}
        open={params.action === "edit"}
        variant="edit"
        onClose={closeModal}
        onConfirm={input =>
          updateCustomerAddress({
            variables: {
              id: params.id,
              input,
            },
          })
        }
      />
      <CustomerAddressDeleteDialog
        confirmButtonState={removeCustomerAddressOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          removeCustomerAddress({
            variables: {
              id: params.id,
            },
          })
        }
        open={params.action === "remove"}
      />
    </>
  );
};

export default CustomerAddresses;
