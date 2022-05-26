import { Card } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { configurationMenuUrl } from "@saleor/configuration";
import { PluginBaseFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { PluginListUrlSortField } from "@saleor/plugins/urls";
import {
  FilterPageProps,
  PageListProps,
  SortPage,
  TabPageProps,
} from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import PluginsList from "../PluginsList/PluginsList";
import {
  createFilterStructure,
  PluginFilterKeys,
  PluginListFilterOpts,
} from "./filters";
import { pluginsFilterErrorMessages } from "./messages";

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
    <Container>
      <Backlink href={configurationMenuUrl}>
        {intl.formatMessage(sectionNames.configuration)}
      </Backlink>
      <PageHeader title={intl.formatMessage(sectionNames.plugins)} />
      <Card>
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
    </Container>
  );
};
PluginsListPage.displayName = "PluginsListPage";
export default PluginsListPage;
