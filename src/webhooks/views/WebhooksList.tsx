import { useApolloClient } from "@apollo/client";
import AppDeleteDialog from "@saleor/apps/components/AppDeleteDialog";
import { EXTENSION_LIST_QUERY } from "@saleor/apps/queries";
import { customAppUrl } from "@saleor/apps/urls";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  AppsListQuery,
  AppSortField,
  AppTypeEnum,
  OrderDirection,
  useAppDeleteMutation,
  useAppsListQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { sectionNames } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import WebhooksListPage from "../components/WebhooksListPage";
import { messages } from "../messages";
import {
  webhookListUrl,
  WebhookListUrlDialog,
  WebhookListUrlQueryParams,
} from "../urls";

const getCurrentAppName = (
  id: string,
  collection?: AppsListQuery["apps"]["edges"],
) => collection?.find(edge => edge.node.id === id)?.node?.name;

interface WebhooksListProps {
  params: WebhookListUrlQueryParams;
}

export const WebhooksList: React.FC<WebhooksListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const client = useApolloClient();

  const [openModal, closeModal] = createDialogActionHandlers<
    WebhookListUrlDialog,
    WebhookListUrlQueryParams
  >(navigate, webhookListUrl, params);

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

  const { data: customAppsData, refetch: customAppsRefetch } = useAppsListQuery(
    {
      displayLoader: true,
      variables: {
        first: 100,
        ...queryVariables,
        filter: {
          type: AppTypeEnum.LOCAL,
        },
      },
    },
  );

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

  const customApps = customAppsData?.apps?.edges;

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.webhooksAndEvents)} />
      <AppDeleteDialog
        confirmButtonState={deleteAppOpts.status}
        name={getCurrentAppName(params.id, customApps)}
        onClose={closeModal}
        onConfirm={handleRemoveConfirm}
        type={"CUSTOM"}
        open={params.action === "remove-custom-app"}
      />
      <WebhooksListPage
        appsList={customApps}
        getCustomAppHref={id => customAppUrl(id)}
        onRemove={id =>
          openModal("remove-custom-app", {
            id,
          })
        }
      />
    </>
  );
};

WebhooksList.displayName = "WebhooksList";
export default WebhooksList;
