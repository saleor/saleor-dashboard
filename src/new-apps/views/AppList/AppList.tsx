import AppListPage from "@saleor/new-apps/components/AppListPage/AppListPage";
import React from "react";

export const AppsList: React.FC = () => {
  const appList = [];

  return <AppListPage appList={appList} />;
};
export default AppsList;
