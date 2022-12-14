import useFetch from "@saleor/hooks/useFetch";
import AppListPage from "@saleor/new-apps/components/AppListPage/AppListPage";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import React from "react";

export const AppsList: React.FC = () => {
  const { data } = useFetch<GetV2SaleorAppsResponse.SaleorApp[]>(
    "https://marketplace-gray.vercel.app/api/v2/saleor-apps?saleor-url=https://master.staging.saleor.cloud/",
  );

  return <AppListPage appList={data} />;
};
export default AppsList;
