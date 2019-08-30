import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { PageListProps } from "@saleor/types";
import { Plugins_plugins_edges_node } from "../../types/Plugins";
import PluginsList from "../PluginsList/PluginsList";

export interface PluginsListPageProps extends PageListProps {
  plugins: Plugins_plugins_edges_node[];
  onBack: () => void;
}

const PluginsListPage: React.StatelessComponent<PluginsListPageProps> = ({
  disabled,
  settings,
  onBack,
  onNextPage,
  onPreviousPage,
  onRowClick,
  onUpdateListSettings,
  pageInfo,
  plugins
}) => {
  const intl = useIntl();
  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.plugins)} />
      <PluginsList
        disabled={disabled}
        settings={settings}
        plugins={plugins}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        onUpdateListSettings={onUpdateListSettings}
        onRowClick={onRowClick}
        pageInfo={pageInfo}
      />
    </Container>
  );
};
PluginsListPage.displayName = "PluginsListPage";
export default PluginsListPage;
