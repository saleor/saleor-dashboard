import { configurationMenuUrl } from "@saleor/configuration";
import useNavigator from "@saleor/hooks/useNavigator";
// import useNotifier from "@saleor/hooks/useNotifier";
// import { commonMessages } from "@saleor/intl";
// import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
// import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import React from "react";

// import { useIntl } from "react-intl";
import MultichannelsListPage from "../../pages/MultichannelsListPage";
import { useChannelsList } from "../../queries";
import {
  channelAddUrl,
  // channelsListUrl,
  // MultichannelsListUrlDialog,
  MultichannelsListUrlQueryParams
} from "../../urls";

interface MultichannelsListProps {
  params: MultichannelsListUrlQueryParams;
}

export const MultichannelsList: React.FC<MultichannelsListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  // const notify = useNotifier();
  const { data, loading } = useChannelsList({ displayLoader: true });
  // const intl = useIntl();

  // const [openModal, closeModal] = createDialogActionHandlers<
  //   MultichannelsListUrlDialog,
  //   MultichannelsListUrlQueryParams
  // >(navigate, channelsListUrl, params);

  const navigateToChannelCreate = () => navigate(channelAddUrl);

  const onRemove = () => null;
  // const  getFilterQueryParam = params => ({ search: params.query });

  return (
    <MultichannelsListPage
      channelsList={data?.channels}
      initialSearch={params.query || ""}
      disabled={loading}
      navigateToChannelCreate={navigateToChannelCreate}
      onBack={() => navigate(configurationMenuUrl)}
      onRowClick={id => () => null}
      onRemove={onRemove}
      onSearchChange={(value: string) => null}
      // onAll={resetFilters}
      // onFilterChange={changeFilters}
    />
  );
};

export default MultichannelsList;
