// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useRemoveCustomerMutation, useUpdateCustomerMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import { FormattedMessage, useIntl } from "react-intl";

import CustomerDetailsPage, {
  type CustomerDetailsPageFormData,
} from "../components/CustomerDetailsPage";
import { CustomerMetadataDialog } from "../components/CustomerMetadataDialog/CustomerMetadataDialog";
import { useCustomerDetails } from "../hooks/useCustomerDetails";
import { CustomerDetailsProvider } from "../providers/CustomerDetailsProvider";
import { customerListUrl, customerUrl, type CustomerUrlQueryParams } from "../urls";

interface CustomerDetailsViewProps {
  id: string;
  params: CustomerUrlQueryParams;
}

const CustomerDetailsViewInner = ({ id, params }: CustomerDetailsViewProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const customerDetails = useCustomerDetails();
  const user = customerDetails?.customer?.user;
  const customerDetailsLoading = customerDetails?.loading;

  const [removeCustomer, removeCustomerOpts] = useRemoveCustomerMutation({
    onCompleted: data => {
      if (data.customerDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "PXatmC",
            defaultMessage: "Customer Removed",
          }),
        });
        navigate(customerListUrl());
      }
    },
  });

  const [updateCustomer, updateCustomerOpts] = useUpdateCustomerMutation();

  // Each `updateCustomer` call site emits its own toast so the message can
  // describe what the user just did (form save vs. activate vs. deactivate).
  const notifyCustomerUpdate = (text: string) =>
    notify({
      status: "success",
      text,
    });

  if (user === null) {
    return <NotFoundPage backHref={customerListUrl()} />;
  }

  const handleSubmit = async (data: CustomerDetailsPageFormData) => {
    const result = await updateCustomer({
      variables: {
        id,
        input: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          note: data.note,
        },
      },
    });

    if (result.data?.customerUpdate.errors.length === 0) {
      notifyCustomerUpdate(
        intl.formatMessage({ id: "PeEood", defaultMessage: "Customer updated" }),
      );
    }

    return extractMutationErrors(Promise.resolve(result));
  };

  // Activate / deactivate is gated behind a confirmation dialog, mirroring the
  // Delete flow: the cogs menu navigates to ?action=activate|deactivate, the
  // dialog confirms, and the mutation fires on confirm.
  const handleActivateToggle = () => {
    if (!user) {
      return;
    }

    navigate(
      customerUrl(id, {
        action: user.isActive ? "deactivate" : "activate",
      }),
    );
  };

  const closeDialog = () => navigate(customerUrl(id), { replace: true });

  // Run the mutation, then emit an action-specific toast and close the dialog
  // on success. The confirm button still transitions through its loading state
  // because we await the mutation result.
  const handleActivateConfirm = async () => {
    const result = await updateCustomer({
      variables: {
        id,
        input: { isActive: true },
      },
    });

    if (result.data?.customerUpdate.errors.length === 0) {
      notifyCustomerUpdate(
        intl.formatMessage({
          defaultMessage: "Customer activated",
          description: "success toast after activating a customer",
          id: "6jt3RB",
        }),
      );
      closeDialog();
    }
  };

  const handleDeactivateConfirm = async () => {
    const result = await updateCustomer({
      variables: {
        id,
        input: { isActive: false },
      },
    });

    if (result.data?.customerUpdate.errors.length === 0) {
      notifyCustomerUpdate(
        intl.formatMessage({
          defaultMessage: "Customer deactivated",
          description: "success toast after deactivating a customer",
          id: "SPzIC5",
        }),
      );
      closeDialog();
    }
  };

  return (
    <>
      <WindowTitle title={user?.email} data-test-id="user-email-title" />
      <CustomerDetailsPage
        customerId={id}
        customer={user}
        disabled={
          customerDetailsLoading || updateCustomerOpts.loading || removeCustomerOpts.loading
        }
        errors={updateCustomerOpts.data?.customerUpdate.errors || []}
        saveButtonBar={updateCustomerOpts.status}
        onSubmit={handleSubmit}
        onActivateToggle={handleActivateToggle}
        onShowMetadata={() =>
          navigate(
            customerUrl(id, {
              action: "view-metadata",
            }),
          )
        }
        onDelete={() =>
          navigate(
            customerUrl(id, {
              action: "remove",
            }),
          )
        }
      />
      <CustomerMetadataDialog
        open={params.action === "view-metadata"}
        onClose={closeDialog}
        customer={user}
      />
      <ActionDialog
        confirmButtonState={removeCustomerOpts.status}
        onClose={closeDialog}
        onConfirm={() =>
          removeCustomer({
            variables: {
              id,
            },
          })
        }
        title={intl.formatMessage({
          id: "ey0lZj",
          defaultMessage: "Delete Customer",
          description: "dialog header",
        })}
        variant="delete"
        open={params.action === "remove"}
      >
        <FormattedMessage
          id="2p0tZx"
          defaultMessage="Are you sure you want to delete {email}?"
          description="delete customer, dialog content"
          values={{
            email: <strong>{getStringOrPlaceholder(user?.email)}</strong>,
          }}
        />
      </ActionDialog>
      <ActionDialog
        confirmButtonState={updateCustomerOpts.status}
        confirmButtonLabel={intl.formatMessage({
          defaultMessage: "Deactivate",
          description: "deactivate customer dialog, confirm button label",
          id: "weguIe",
        })}
        onClose={closeDialog}
        onConfirm={handleDeactivateConfirm}
        title={intl.formatMessage({
          defaultMessage: "Deactivate customer",
          description: "deactivate customer dialog, header",
          id: "8maISA",
        })}
        variant="delete"
        open={params.action === "deactivate"}
      >
        <FormattedMessage
          defaultMessage="Are you sure you want to deactivate {email}? They will no longer be able to sign in or place new orders."
          description="deactivate customer dialog, content"
          id="genRi+"
          values={{
            email: <strong>{getStringOrPlaceholder(user?.email)}</strong>,
          }}
        />
      </ActionDialog>
      <ActionDialog
        confirmButtonState={updateCustomerOpts.status}
        confirmButtonLabel={intl.formatMessage({
          defaultMessage: "Activate",
          description: "activate customer dialog, confirm button label",
          id: "Ruw3iJ",
        })}
        onClose={closeDialog}
        onConfirm={handleActivateConfirm}
        title={intl.formatMessage({
          defaultMessage: "Activate customer",
          description: "activate customer dialog, header",
          id: "Le6/M7",
        })}
        open={params.action === "activate"}
      >
        <FormattedMessage
          defaultMessage="Are you sure you want to activate {email}? They will be able to sign in and place new orders."
          description="activate customer dialog, content"
          id="6a075o"
          values={{
            email: <strong>{getStringOrPlaceholder(user?.email)}</strong>,
          }}
        />
      </ActionDialog>
    </>
  );
};

const CustomerDetailsView = ({ id, params }: CustomerDetailsViewProps) => (
  <CustomerDetailsProvider key={id} id={id}>
    <CustomerDetailsViewInner id={id} params={params} />
  </CustomerDetailsProvider>
);

export default CustomerDetailsView;
