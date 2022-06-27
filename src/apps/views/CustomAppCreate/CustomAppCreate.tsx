import { WindowTitle } from "@saleor/components/WindowTitle";
import { AppCreateMutation, useAppCreateMutation } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

import CustomAppCreatePage, {
  CustomAppCreatePageFormData,
} from "../../components/CustomAppCreatePage";
import { customAppUrl } from "../../urls";
import { messages } from "./messages";

interface CustomAppCreateProps {
  setToken: (token: string) => void;
}
export const CustomAppCreate: React.FC<CustomAppCreateProps> = ({
  setToken,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const onSubmit = (data: AppCreateMutation) => {
    if (data.appCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      navigate(customAppUrl(data.appCreate.app.id));
      setToken(data.appCreate.authToken);
    }
  };

  const [createApp, createAppOpts] = useAppCreateMutation({
    onCompleted: onSubmit,
  });

  const handleSubmit = async (data: CustomAppCreatePageFormData) =>
    extractMutationErrors(
      createApp({
        variables: {
          input: {
            name: data.name,
            permissions: data.hasFullAccess
              ? shop.permissions.map(permission => permission.code)
              : data.permissions,
          },
        },
      }),
    );

  return (
    <>
      <WindowTitle title={intl.formatMessage(messages.createApp)} />
      <CustomAppCreatePage
        disabled={false}
        errors={createAppOpts.data?.appCreate.errors || []}
        onSubmit={handleSubmit}
        permissions={shop?.permissions}
        saveButtonBarState={createAppOpts.status}
      />
    </>
  );
};

export default CustomAppCreate;
