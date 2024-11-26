// @ts-strict-ignore
import { useApolloClient } from "@apollo/client";
import AppDeleteDialog from "@dashboard/apps/components/AppDeleteDialog";
import { EXTENSION_LIST_QUERY } from "@dashboard/apps/queries";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  AppSortField,
  AppTypeEnum,
  OrderDirection,
  useAppDeleteMutation,
  useAppsListQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { sectionNames } from "@dashboard/intl";
import { findById } from "@dashboard/misc";
import { useOnboarding } from "@dashboard/newHome/homeOnboarding/onboardingContext";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import CustomAppListPage from "../components/CustomAppListPage";
import { messages } from "../messages";
import { CustomAppListUrlDialog, CustomAppListUrlQueryParams, CustomAppUrls } from "../urls";

interface CustomAppListProps {
  params: CustomAppListUrlQueryParams;
}

export const CustomAppList: React.FC<CustomAppListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const client = useApolloClient();
  const { markOnboardingStepAsCompleted } = useOnboarding();

  useEffect(() => {
    markOnboardingStepAsCompleted("view-webhooks");
  }, []);

  const [openModal, closeModal] = createDialogActionHandlers<
    CustomAppListUrlDialog,
    CustomAppListUrlQueryParams
  >(navigate, CustomAppUrls.resolveAppListUrl, params);
  const removeAppNotify = () => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appRemoved),
    });
  };
  const refetchExtensionList = () => {
    client.refetchQueries({
      include: [EXTENSION_LIST_QUERY],
    });
  };
  const queryVariables = {
    sort: {
      direction: OrderDirection.DESC,
      field: AppSortField.CREATION_DATE,
    },
  };
  const { data: customAppsData, refetch: customAppsRefetch } = useAppsListQuery({
    displayLoader: true,
    variables: {
      first: 100,
      ...queryVariables,
      filter: {
        type: AppTypeEnum.LOCAL,
      },
    },
  });
  const [deleteApp, deleteAppOpts] = useAppDeleteMutation({
    onCompleted: data => {
      if (!data?.appDelete?.errors?.length) {
        customAppsRefetch();
        closeModal();
        refetchExtensionList();
        removeAppNotify();
      }
    },
  });
  const handleRemoveConfirm = () =>
    deleteApp({
      variables: {
        id: params.id,
      },
    });
  const customApps = mapEdgesToItems(customAppsData?.apps);
  const currentAppName = findById(params.id, customApps)?.name;

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.webhooksAndEvents)} />
      <AppDeleteDialog
        confirmButtonState={deleteAppOpts.status}
        name={currentAppName}
        onClose={closeModal}
        onConfirm={handleRemoveConfirm}
        type="CUSTOM"
        open={params.action === "remove-custom-app"}
      />
      <CustomAppListPage
        appsList={customApps}
        getCustomAppHref={id => CustomAppUrls.resolveAppUrl(id)}
        onRemove={id =>
          openModal("remove-custom-app", {
            id,
          })
        }
      />
    </>
  );
};

CustomAppList.displayName = "CustomAppList";
export default CustomAppList;
