// @ts-strict-ignore
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import { AppCreateMutation, useAppCreateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import { useIntl } from "react-intl";

import CustomAppCreatePage, {
  CustomAppCreatePageFormData,
} from "../../components/CustomAppCreatePage";
import { messages } from "./messages";

interface CustomAppCreateProps {
  setToken: (token: string) => void;
}

export const CustomAppCreate = ({ setToken }: CustomAppCreateProps) => {
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
      navigate(CustomAppUrls.resolveAppUrl(data.appCreate.app.id));
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
