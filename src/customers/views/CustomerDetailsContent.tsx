import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { extractMutationErrors, getStringOrPlaceholder } from "@saleor/misc";
import { MutationResultAdditionalProps } from "@saleor/types";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React, { useContext } from "react";
import { MutationFunction, MutationResult } from "react-apollo";
import { FormattedMessage, useIntl } from "react-intl";

import { orderListUrl, orderUrl } from "../../orders/urls";
import CustomerDetailsPage, {
  CustomerDetailsPageFormData
} from "../components/CustomerDetailsPage/CustomerDetailsPage";
import { CustomerDetailsContext } from "../providers/CustomerDetailsProvider";
import {
  RemoveCustomer,
  RemoveCustomerVariables
} from "../types/RemoveCustomer";
import {
  UpdateCustomer,
  UpdateCustomerVariables
} from "../types/UpdateCustomer";
import {
  customerAddressesUrl,
  customerUrl,
  CustomerUrlQueryParams
} from "../urls";

export interface CustomerDetailsContentProps {
  handleBack: () => void;
  updateCustomer: MutationFunction<UpdateCustomer, UpdateCustomerVariables>;
  removeCustomer: MutationFunction<RemoveCustomer, RemoveCustomerVariables>;
  id: string;
  updateCustomerOpts: MutationResult<UpdateCustomer> &
    MutationResultAdditionalProps;
  removeCustomerOpts: MutationResult<RemoveCustomer> &
    MutationResultAdditionalProps;
  navigate: UseNavigatorResult;
  params: CustomerUrlQueryParams;
}

export const CustomerDetailsContent: React.FC<CustomerDetailsContentProps> = ({
  handleBack,
  updateCustomer,
  id,
  updateCustomerOpts,
  removeCustomerOpts,
  navigate,
  removeCustomer,
  params
}) => {
  const customerDetails = useContext(CustomerDetailsContext);
  const user = customerDetails?.customer?.user;
  const customerDetailsLoading = customerDetails?.loading;

  const intl = useIntl();

  if (user === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const updateData = async (data: CustomerDetailsPageFormData) =>
    extractMutationErrors(
      updateCustomer({
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
      })
    );

  const handleSubmit = createMetadataUpdateHandler(
    user,
    updateData,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );

  return (
    <>
      <WindowTitle title={user?.email} />
      <CustomerDetailsPage
        customer={user}
        disabled={
          customerDetailsLoading ||
          updateCustomerOpts.loading ||
          removeCustomerOpts.loading
        }
        errors={updateCustomerOpts.data?.customerUpdate.errors || []}
        saveButtonBar={updateCustomerOpts.status}
        onAddressManageClick={() => navigate(customerAddressesUrl(id))}
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
              customer: user?.email
            })
          )
        }
      />
      <ActionDialog
        confirmButtonState={removeCustomerOpts.status}
        onClose={() => navigate(customerUrl(id), { replace: true })}
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
              email: <strong>{getStringOrPlaceholder(user?.email)}</strong>
            }}
          />
        </DialogContentText>
      </ActionDialog>
    </>
  );
};
