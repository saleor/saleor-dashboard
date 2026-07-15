// @ts-strict-ignore
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useRemoveCustomerMutation, useUpdateCustomerMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import { useIntl } from "react-intl";

import { CustomerDeleteDialog } from "../components/CustomerDeleteDialog/CustomerDeleteDialog";
import CustomerDetailsPage, {
  type CustomerDetailsPageFormData,
} from "../components/CustomerDetailsPage";
import { CustomerMetadataDialog } from "../components/CustomerMetadataDialog/CustomerMetadataDialog";
import { CustomerStatusChangeDialog } from "../components/CustomerStatusChangeDialog/CustomerStatusChangeDialog";
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
  const customerEmail = <strong>{getStringOrPlaceholder(user?.email)}</strong>;
  const isStatusDialogOpen = params.action === "activate" || params.action === "deactivate";

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
      <CustomerDeleteDialog
        confirmButtonState={removeCustomerOpts.status}
        email={customerEmail}
        onClose={closeDialog}
        onConfirm={() =>
          removeCustomer({
            variables: {
              id,
            },
          })
        }
        open={params.action === "remove"}
      />
      <CustomerStatusChangeDialog
        confirmButtonState={isStatusDialogOpen ? updateCustomerOpts.status : "default"}
        email={customerEmail}
        onClose={closeDialog}
        onConfirm={params.action === "deactivate" ? handleDeactivateConfirm : handleActivateConfirm}
        open={isStatusDialogOpen}
        variant={params.action === "deactivate" ? "deactivate" : "activate"}
      />
    </>
  );
};

const CustomerDetailsView = ({ id, params }: CustomerDetailsViewProps) => (
  <CustomerDetailsProvider key={id} id={id}>
    <CustomerDetailsViewInner id={id} params={params} />
  </CustomerDetailsProvider>
);

export default CustomerDetailsView;
