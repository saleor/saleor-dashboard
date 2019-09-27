import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
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

  return (
    <ServiceDetailsQuery
      displayLoader
      variables={{ id }}
      require={["serviceAccount"]}
    >
      {({ data, loading }) => {
        const onServiceUpdate = (data: ServiceUpdate) => {
          if (!maybe(() => data.serviceUpdate.errors.length !== 0)) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
          }
        };
        const onServiceDelete = (data: ServiceDelete) => {
          if (!maybe(() => data.serviceDelete.errors.length !== 0)) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            navigate(serviceListUrl());
          }
        };

        const handleBack = () => navigate(serviceListUrl());

        const handleSubmit = (data: ServiceDetailsPageFormData) => undefined;

        return (
          <>
            <WindowTitle title={maybe(() => data.serviceAccount.name)} />
            <ServiceDetailsPage
              disabled={loading}
              errors={[]}
              onBack={handleBack}
              onDelete={() => openModal("remove")}
              onSubmit={handleSubmit}
              onTokenCreate={() => openModal("create-token")}
              onTokenDelete={() => openModal("delete-token")}
              permissions={maybe(() => shop.permissions)}
              service={maybe(() => data.serviceAccount)}
              saveButtonBarState="default"
            />
          </>
        );
      }}
    </ServiceDetailsQuery>
  );
};

export default ServiceDetails;
