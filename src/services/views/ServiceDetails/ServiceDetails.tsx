import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import ServiceDeleteDialog from "@saleor/services/components/ServiceDeleteDialog";
import {
  ServiceDeleteMutation,
  ServiceUpdateMutation
} from "@saleor/services/mutations";
import { ServiceDelete } from "@saleor/services/types/ServiceDelete";
import { ServiceUpdate } from "@saleor/services/types/ServiceUpdate";
import ServiceDetailsPage, {
  ServiceDetailsPageFormData
} from "../../components/ServiceDetailsPage";
import { ServiceDetailsQuery } from "../../queries";
import {
  serviceListUrl,
  serviceUrl,
  ServiceUrlDialog,
  ServiceUrlQueryParams
} from "../../urls";

interface OrderListProps {
  id: string;
  params: ServiceUrlQueryParams;
}

export const ServiceDetails: React.StatelessComponent<OrderListProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const closeModal = () =>
    navigate(
      serviceUrl(id, {
        ...params,
        action: undefined,
        id: undefined
      }),
      true
    );

  const openModal = (action: ServiceUrlDialog, tokenId?: string) =>
    navigate(
      serviceUrl(id, {
        ...params,
        action,
        id: tokenId
      })
    );

  const onServiceUpdate = (data: ServiceUpdate) => {
    if (!maybe(() => data.serviceAccountUpdate.errors.length !== 0)) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };
  const onServiceDelete = (data: ServiceDelete) => {
    if (data.serviceAccountDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(serviceListUrl());
    }
  };

  const handleBack = () => navigate(serviceListUrl());

  return (
    <ServiceDetailsQuery
      displayLoader
      variables={{ id }}
      require={["serviceAccount"]}
    >
      {({ data, loading }) => (
        <ServiceUpdateMutation onCompleted={onServiceUpdate}>
          {(updateService, updateServiceOpts) => (
            <ServiceDeleteMutation onCompleted={onServiceDelete}>
              {(deleteService, deleteServiceOpts) => {
                const handleSubmit = (data: ServiceDetailsPageFormData) =>
                  updateService({
                    variables: {
                      id,
                      input: {
                        isActive: data.isActive,
                        name: data.name,
                        permissions: data.hasFullAccess
                          ? shop.permissions.map(permission => permission.code)
                          : data.permissions
                      }
                    }
                  });

                const handleRemoveConfirm = () =>
                  deleteService({
                    variables: {
                      id
                    }
                  });

                const formTransitionState = getMutationState(
                  updateServiceOpts.called,
                  updateServiceOpts.loading,
                  maybe(
                    () => updateServiceOpts.data.serviceAccountUpdate.errors
                  )
                );

                const deleteTransitionState = getMutationState(
                  deleteServiceOpts.called,
                  deleteServiceOpts.loading,
                  maybe(
                    () => deleteServiceOpts.data.serviceAccountDelete.errors
                  )
                );

                return (
                  <>
                    <WindowTitle
                      title={maybe(() => data.serviceAccount.name)}
                    />
                    <ServiceDetailsPage
                      disabled={loading}
                      errors={[]}
                      onBack={handleBack}
                      onDelete={() => openModal("remove")}
                      onSubmit={handleSubmit}
                      onTokenCreate={() => openModal("create-token")}
                      onTokenDelete={() => openModal("remove-token")}
                      permissions={maybe(() => shop.permissions)}
                      service={maybe(() => data.serviceAccount)}
                      saveButtonBarState={formTransitionState}
                    />
                    <ServiceDeleteDialog
                      confirmButtonState={deleteTransitionState}
                      name={maybe(() => data.serviceAccount.name, "...")}
                      onClose={closeModal}
                      onConfirm={handleRemoveConfirm}
                      open={params.action === "remove"}
                    />
                  </>
                );
              }}
            </ServiceDeleteMutation>
          )}
        </ServiceUpdateMutation>
      )}
    </ServiceDetailsQuery>
  );
};

export default ServiceDetails;
