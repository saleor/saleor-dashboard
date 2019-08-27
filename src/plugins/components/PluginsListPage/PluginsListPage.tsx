import React from "react";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import i18n from "@saleor/i18n";
import { ListActionsWithoutToolbar, PageListProps } from "@saleor/types";
import { PluginConfigurations_pluginConfigurations_edges_node } from "../../types/PluginConfigurations";
import PluginsList from "../PluginsList/PluginsList";

export interface PluginsListPageProps
  extends PageListProps,
    ListActionsWithoutToolbar {
  plugins: PluginConfigurations_pluginConfigurations_edges_node[];
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
  plugins,
  isChecked,
  selected,
  toggle,
  toggleAll
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
      isChecked={isChecked}
      selected={selected}
      toggle={toggle}
      toggleAll={toggleAll}
    />
  </Container>
);
PluginsListPage.displayName = "PluginsListPage";
export default PluginsListPage;
