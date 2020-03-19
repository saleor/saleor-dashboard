import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import { API_URI } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { maybe, getStringOrPlaceholder } from "@saleor/misc";
import ServiceDeleteDialog from "@saleor/services/components/ServiceDeleteDialog";
import ServiceTokenCreateDialog from "@saleor/services/components/ServiceTokenCreateDialog";
import ServiceTokenDeleteDialog from "@saleor/services/components/ServiceTokenDeleteDialog";
import {
  ServiceDeleteMutation,
  ServiceTokenCreateMutation,
  ServiceTokenDeleteMutation,
  ServiceUpdateMutation
} from "@saleor/services/mutations";
import { ServiceDelete } from "@saleor/services/types/ServiceDelete";
import { ServiceTokenCreate } from "@saleor/services/types/ServiceTokenCreate";
import { ServiceTokenDelete } from "@saleor/services/types/ServiceTokenDelete";
import { ServiceUpdate } from "@saleor/services/types/ServiceUpdate";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import NotFoundPage from "@saleor/components/NotFoundPage";
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
  token: string;
  onTokenClose: () => void;
}

export const ServiceDetails: React.FC<OrderListProps> = ({
  id,
  params,
  token,
  onTokenClose
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  React.useEffect(() => onTokenClose, []);

  const [openModal, closeModal] = createDialogActionHandlers<
    ServiceUrlDialog,
    ServiceUrlQueryParams
  >(navigate, params => serviceUrl(id, params), params);

  const onServiceUpdate = (data: ServiceUpdate) => {
    if (maybe(() => data.serviceAccountUpdate.errors.length === 0)) {
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
    <ServiceDetailsQuery displayLoader variables={{ id }}>
      {({ data, loading, refetch }) => {
        const service = data?.serviceAccount;

        if (service === null) {
          return <NotFoundPage onBack={handleBack} />;
        }

        const onTokenCreate = (data: ServiceTokenCreate) => {
          if (maybe(() => data.serviceAccountTokenCreate.errors.length === 0)) {
            refetch();
          }
        };
        const onTokenDelete = (data: ServiceTokenDelete) => {
          if (maybe(() => data.serviceAccountTokenDelete.errors.length === 0)) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            refetch();
            closeModal();
          }
        };

        return (
          <ServiceUpdateMutation onCompleted={onServiceUpdate}>
            {(updateService, updateServiceOpts) => (
              <ServiceDeleteMutation onCompleted={onServiceDelete}>
                {(deleteService, deleteServiceOpts) => (
                  <ServiceTokenCreateMutation onCompleted={onTokenCreate}>
                    {(createToken, createTokenOpts) => (
                      <ServiceTokenDeleteMutation onCompleted={onTokenDelete}>
                        {(deleteToken, deleteTokenOpts) => {
                          const handleSubmit = (
                            data: ServiceDetailsPageFormData
                          ) =>
                            updateService({
                              variables: {
                                id,
                                input: {
                                  isActive: data.isActive,
                                  name: data.name,
                                  permissions: data.hasFullAccess
                                    ? shop.permissions.map(
                                        permission => permission.code
                                      )
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

                          const handleTokenCreate = (name: string) =>
                            createToken({
                              variables: {
                                input: {
                                  name,
                                  serviceAccount: id
                                }
                              }
                            });

                          const handleTokenDelete = () =>
                            deleteToken({
                              variables: {
                                id: params.id
                              }
                            });

                          return (
                            <>
                              <WindowTitle
                                title={getStringOrPlaceholder(service?.name)}
                              />
                              <ServiceDetailsPage
                                apiUri={API_URI}
                                disabled={loading}
                                errors={
                                  updateServiceOpts.data?.serviceAccountUpdate
                                    .errors || []
                                }
                                token={token}
                                onApiUriClick={() => open(API_URI, "blank")}
                                onBack={handleBack}
                                onDelete={() => openModal("remove")}
                                onSubmit={handleSubmit}
                                onTokenClose={onTokenClose}
                                onTokenCreate={() => openModal("create-token")}
                                onTokenDelete={id =>
                                  openModal("remove-token", {
                                    id
                                  })
                                }
                                permissions={shop?.permissions}
                                service={data?.serviceAccount}
                                saveButtonBarState={updateServiceOpts.status}
                              />
                              <ServiceDeleteDialog
                                confirmButtonState={deleteServiceOpts.status}
                                name={getStringOrPlaceholder(
                                  data?.serviceAccount?.name
                                )}
                                onClose={closeModal}
                                onConfirm={handleRemoveConfirm}
                                open={params.action === "remove"}
                              />
                              <ServiceTokenCreateDialog
                                confirmButtonState={createTokenOpts.status}
                                onClose={closeModal}
                                onCreate={handleTokenCreate}
                                open={params.action === "create-token"}
                                token={
                                  createTokenOpts.data
                                    ?.serviceAccountTokenCreate.authToken
                                }
                              />
                              <ServiceTokenDeleteDialog
                                confirmButtonState={deleteTokenOpts.status}
                                name={maybe(() => {
                                  const token = data.serviceAccount.tokens.find(
                                    token => token.id === params.id
                                  );
                                  if (token.name) {
                                    return token.name;
                                  }

                                  return `**** ${token.authToken}`;
                                }, "...")}
                                onClose={closeModal}
                                onConfirm={handleTokenDelete}
                                open={params.action === "remove-token"}
                              />
                            </>
                          );
                        }}
                      </ServiceTokenDeleteMutation>
                    )}
                  </ServiceTokenCreateMutation>
                )}
              </ServiceDeleteMutation>
            )}
          </ServiceUpdateMutation>
        );
      }}
    </ServiceDetailsQuery>
  );
};

export default ServiceDetails;
