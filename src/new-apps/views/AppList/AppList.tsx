import {
  AppSortField,
  AppTypeEnum,
  OrderDirection,
  useAppsListQuery,
} from "@saleor/graphql";
import useFetch from "@saleor/hooks/useFetch";
import useListSettings from "@saleor/hooks/useListSettings";
import { createPaginationState } from "@saleor/hooks/usePaginator";
import AppListPage from "@saleor/new-apps/components/AppListPage/AppListPage";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import { AppListUrlQueryParams } from "@saleor/new-apps/urls";
import { ListViews } from "@saleor/types";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

interface AppsListProps {
  params: AppListUrlQueryParams;
}

export const AppsList: React.FC<AppsListProps> = ({ params }) => {
  const { updateListSettings, settings } = useListSettings(ListViews.APPS_LIST);
  const paginationState = createPaginationState(settings?.rowNumber, params);
  const queryVariables = {
    sort: {
      direction: OrderDirection.DESC,
      field: AppSortField.CREATION_DATE,
    },
  };

  const { data: installedApps, loading, refetch } = useAppsListQuery({
    displayLoader: true,
    variables: {
      ...paginationState,
      ...queryVariables,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
    },
  });
  const installedAppList = mapEdgesToItems(installedApps?.apps);

  const { data: marketplaceAppList } = useFetch<
    GetV2SaleorAppsResponse.SaleorApp[]
  >(
    "https://marketplace-gray.vercel.app/api/v2/saleor-apps?saleor-url=https://master.staging.saleor.cloud/",
  );

  return (
    <AppListPage
      marketplaceAppList={marketplaceAppList}
      installedAppList={installedAppList}
    />
  );
};
export default AppsList;
