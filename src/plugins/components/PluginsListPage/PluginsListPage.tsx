import React from "react";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import i18n from "@saleor/i18n";
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
}) => (
  <Container>
    <AppHeader onBack={onBack}>{i18n.t("Configuration")}</AppHeader>
    <PageHeader title={i18n.t("Plugins")} />
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
PluginsListPage.displayName = "PluginsListPage";
export default PluginsListPage;
