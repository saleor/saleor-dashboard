// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useRemoveCustomerMutation, useUpdateCustomerMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import { FormattedMessage, useIntl } from "react-intl";

import CustomerDetailsPage, {
  CustomerDetailsPageFormData,
} from "../components/CustomerDetailsPage";
import { useCustomerDetails } from "../hooks/useCustomerDetails";
import { CustomerDetailsProvider } from "../providers/CustomerDetailsProvider";
import { customerListUrl, customerUrl, CustomerUrlQueryParams } from "../urls";

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

  const [updateCustomer, updateCustomerOpts] = useUpdateCustomerMutation({
    onCompleted: data => {
      if (data.customerUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  if (user === null) {
    return <NotFoundPage backHref={customerListUrl()} />;
  }

  const handleSubmit = async (data: CustomerDetailsPageFormData) =>
    extractMutationErrors(
      updateCustomer({
        variables: {
          id,
          input: {
            email: data.email,
            firstName: data.firstName,
            isActive: data.isActive,
            lastName: data.lastName,
            note: data.note,
            metadata: data.metadata,
            privateMetadata: data.privateMetadata,
          },
        },
      }),
    );

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
        onDelete={() =>
          navigate(
            customerUrl(id, {
              action: "remove",
            }),
          )
        }
      />
      <ActionDialog
        confirmButtonState={removeCustomerOpts.status}
        onClose={() => navigate(customerUrl(id), { replace: true })}
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
    </>
  );
};

const CustomerDetailsView = ({ id, params }: CustomerDetailsViewProps) => (
  <CustomerDetailsProvider id={id}>
    <CustomerDetailsViewInner id={id} params={params} />
  </CustomerDetailsProvider>
);

export default CustomerDetailsView;
