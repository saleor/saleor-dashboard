import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import React from "react";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import i18n from "@saleor/i18n";
import { ListActions, PageListProps } from "@saleor/types";
import { PageList_pages_edges_node } from "../../types/PageList";
import PluginsList from "../PluginsList/PluginsList";

export interface PluginsListPageProps extends PageListProps, ListActions {
  pages: PageList_pages_edges_node[];
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
  toggleAll,
  toolbar
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
      toolbar={toolbar}
    />
  </Container>
);
PluginsListPage.displayName = "PluginsListPage";
export default PluginsListPage;
