import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import { ServiceCreateMutation } from "@saleor/services/mutations";
import ServiceCreatePage, {
  ServiceCreatePageFormData
} from "../../components/ServiceCreatePage";
import { serviceListUrl, serviceUrl, ServiceUrlQueryParams } from "../../urls";

export const ServiceCreate: React.StatelessComponent = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const onSubmit = () => undefined;

  const handleBack = () => navigate(serviceListUrl());

  return (
    <ServiceCreateMutation onCompleted={onSubmit}>
      {(serviceCreate, serviceCreateOpts) => {
        const handleSubmit = (data: ServiceCreatePageFormData) =>
          serviceCreate({
            variables: {
              input: {
                isActive: data.isActive,
                name: data.name,
                permissions: data.hasFullAccess
                  ? shop.permissions.map(permission => permission.code)
                  : data.permissions
              }
            }
          });

        const formTransitionState = getMutationState(
          serviceCreateOpts.called,
          serviceCreateOpts.loading,
          maybe(() => serviceCreateOpts.data.serviceAccountCreate.errors)
        );

        return (
          <>
            <WindowTitle
              title={intl.formatMessage({
                defaultMessage: "Create Service Account",
                description: "window title"
              })}
            />
            <ServiceCreatePage
              disabled={false}
              errors={[]}
              onBack={handleBack}
              onSubmit={handleSubmit}
              permissions={maybe(() => shop.permissions)}
              saveButtonBarState={formTransitionState}
            />
          </>
        );
      }}
    </ServiceCreateMutation>
  );
};

export default ServiceCreate;
