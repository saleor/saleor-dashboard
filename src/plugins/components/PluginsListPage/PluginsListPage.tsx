// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import ExternalLink from "@dashboard/components/ExternalLink";
import FilterBar from "@dashboard/components/FilterBar";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { configurationMenuUrl } from "@dashboard/configuration";
import { PluginBaseFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { PluginListUrlSortField } from "@dashboard/plugins/urls";
import {
  FilterPageProps,
  PageListProps,
  SortPage,
  TabPageProps,
} from "@dashboard/types";
import { Card, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React from "react";
import { useIntl } from "react-intl";

import PluginsList from "../PluginsList/PluginsList";
import {
  createFilterStructure,
  PluginFilterKeys,
  PluginListFilterOpts,
} from "./filters";
import {
  pluginsFilterErrorMessages,
  pluginsListPageMessages,
} from "./messages";

export interface PluginsListPageProps
  extends PageListProps,
    FilterPageProps<PluginFilterKeys, PluginListFilterOpts>,
    SortPage<PluginListUrlSortField>,
    TabPageProps {
  plugins: PluginBaseFragment[];
}

const PluginsListPage: React.FC<PluginsListPageProps> = ({
  currentTab,
  initialSearch,
  filterOpts,
  tabs,
  onAll,
  onSearchChange,
  onFilterChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  ...listProps
}) => {
  const intl = useIntl();

  const filterStructure = createFilterStructure(intl, filterOpts);

  return (
    <ListPageLayout>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage(sectionNames.plugins)}
      />
      <Card>
        <div>
          <Alert severity="warning" title="Warning">
            <Typography variant="body1">
              {intl.formatMessage(pluginsListPageMessages.appStoreWarning)}{" "}
              <ExternalLink
                target="blank"
                typographyProps={{ display: "inline" }}
                href="https://docs.saleor.io/docs/3.x/developer/app-store/overview"
              >
                Saleor App Store.
              </ExternalLink>
            </Typography>
          </Alert>
        </div>
        <FilterBar
          errorMessages={pluginsFilterErrorMessages}
          currentTab={currentTab}
          initialSearch={initialSearch}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
          tabs={tabs}
          allTabLabel={intl.formatMessage({
            id: "aOelhW",
            defaultMessage: "All Plugins",
            description: "tab name",
          })}
          filterStructure={filterStructure}
          searchPlaceholder={intl.formatMessage({
            id: "BtErCZ",
            defaultMessage: "Search Plugins...",
          })}
        />
        <PluginsList {...listProps} />
      </Card>
    </ListPageLayout>
  );
};
PluginsListPage.displayName = "PluginsListPage";
export default PluginsListPage;
