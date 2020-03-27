import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { ServiceCreateMutation } from "@saleor/services/mutations";
import { ServiceCreate as ServiceCreateData } from "@saleor/services/types/ServiceCreate";
import ServiceCreatePage, {
  ServiceCreatePageFormData
} from "../../components/ServiceCreatePage";
import { serviceListUrl, serviceUrl } from "../../urls";

interface ServiceCreateProps {
  setToken: (token: string) => void;
}
export const ServiceCreate: React.FC<ServiceCreateProps> = ({ setToken }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const onSubmit = (data: ServiceCreateData) => {
    if (data.serviceAccountCreate.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(serviceUrl(data.serviceAccountCreate.serviceAccount.id));
      setToken(data.serviceAccountCreate.authToken);
    }
  };

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
              errors={serviceCreateOpts.data?.serviceAccountCreate.errors || []}
              onBack={handleBack}
              onSubmit={handleSubmit}
              permissions={shop?.permissions}
              saveButtonBarState={serviceCreateOpts.status}
            />
          </>
        );
      }}
    </ServiceCreateMutation>
  );
};

export default ServiceCreate;
