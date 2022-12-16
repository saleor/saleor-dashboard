import {
  AppSortField,
  AppTypeEnum,
  OrderDirection,
  useAppsListQuery,
} from "@saleor/graphql";
import useFetch from "@saleor/hooks/useFetch";
import useListSettings from "@saleor/hooks/useListSettings";
import useLocalPaginator, {
  useLocalPaginationState,
} from "@saleor/hooks/useLocalPaginator";
import { PaginatorContext } from "@saleor/hooks/usePaginator";
import AppListPage from "@saleor/new-apps/components/AppListPage/AppListPage";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import { AppListUrlQueryParams } from "@saleor/new-apps/urls";
import {
  getComingSoonMarketplaceApps,
  getInstallableMarketplaceApps,
} from "@saleor/new-apps/utils";
import { ListViews } from "@saleor/types";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

interface AppsListProps {
  params: AppListUrlQueryParams;
}

export const AppsList: React.FC<AppsListProps> = () => {
  const { updateListSettings, settings } = useListSettings(ListViews.APPS_LIST);
  const queryVariables = {
    sort: {
      direction: OrderDirection.DESC,
      field: AppSortField.CREATION_DATE,
    },
  };

  const [paginationState, setPaginationState] = useLocalPaginationState(
    settings?.rowNumber,
  );
  const paginate = useLocalPaginator(setPaginationState);

  const { data: installedAppsData, loading /* refetch */ } = useAppsListQuery({
    displayLoader: true,
    variables: {
      ...paginationState,
      ...queryVariables,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
    },
  });
  const { pageInfo, ...paginationValues } = paginate(
    installedAppsData?.apps.pageInfo,
    paginationState,
  );
  const installedApps = mapEdgesToItems(installedAppsData?.apps);

  const { data: marketplaceAppList } = useFetch<
    GetV2SaleorAppsResponse.SaleorApp[]
  >(
    "https://marketplace-gray.vercel.app/api/v2/saleor-apps?saleor-url=https://master.staging.saleor.cloud/",
  );

  const installableMarketplaceApps = getInstallableMarketplaceApps(
    marketplaceAppList,
  );
  const comingSoonMarketplaceApps = getComingSoonMarketplaceApps(
    marketplaceAppList,
  );

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <AppListPage
        installedApps={installedApps}
        installableMarketplaceApps={installableMarketplaceApps}
        comingSoonMarketplaceApps={comingSoonMarketplaceApps}
        disabled={loading}
        settings={settings}
        onUpdateListSettings={updateListSettings}
      />
    </PaginatorContext.Provider>
  );
};
export default AppsList;
