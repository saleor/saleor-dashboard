import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { AllRipplesModal } from "@dashboard/ripples/components/AllRipplesModal";
import { useAllRipplesModalState } from "@dashboard/ripples/state";
import { useCanSearch } from "@dashboard/search/useCanSearch";
import { useSearchHotkey } from "@dashboard/search/useSearchHotkey";
import { Drawer } from "@saleor/macaw-ui-next";
import { useHotkeys } from "react-hotkeys-hook";

import { SidebarContent } from "./Content";
import classes from "./Sidebar.module.css";
import { SidebarAppBar } from "./SidebarAppBar";
import { useSidebarBreakpointContext, useSidebarCollapse } from "./SidebarContext";
import { SidebarDrawerContent, useDrawerRemount } from "./SidebarDrawer";
import { useSidebarCollapseToggle } from "./useSidebarCollapseToggle";
import { type SidebarLayout, useSidebarLayout } from "./useSidebarLayout";
import { useSidebarLogo } from "./useSidebarLogo";

const PersistentSidebar = () => {
  const { isCollapsed } = useSidebarCollapse();
  const toggleCollapsed = useSidebarCollapseToggle();

  useHotkeys("mod+b", event => {
    event.preventDefault();
    toggleCollapsed("shortcut");
  });

  return (
    <div className={classes.column} data-collapsed={isCollapsed} data-test-id="sidebar-column">
      <div className={classes.columnContent}>
        <SidebarContent variant="collapsible" />
      </div>
    </div>
  );
};

/** The logo in the rail is the drawer trigger, so the full navigation opens over the page. */
const RailSidebar = () => {
  const drawer = useDrawerRemount();

  return (
    <Drawer key={drawer.key}>
      <div className={classes.column} data-collapsed data-test-id="sidebar-rail">
        <div className={classes.columnContent}>
          <SidebarContent variant="rail" />
        </div>
      </div>
      <SidebarDrawerContent onClose={drawer.close}>
        <SidebarContent />
      </SidebarDrawerContent>
    </Drawer>
  );
};

const DrawerSidebar = () => {
  const drawer = useDrawerRemount();
  const logo = useSidebarLogo();
  const canSearch = useCanSearch();
  const { trackEvent } = useAnalytics();

  return (
    <Drawer key={drawer.key}>
      <SidebarAppBar
        logo={logo}
        canSearch={canSearch}
        onMenuOpen={() => trackEvent("sidebar_drawer_opened", { layout: "drawer" })}
      />
      <SidebarDrawerContent onClose={drawer.close}>
        <SidebarContent />
      </SidebarDrawerContent>
    </Drawer>
  );
};

const SidebarForLayout = ({ layout }: { layout: SidebarLayout }) => {
  switch (layout) {
    case "column":
      return <PersistentSidebar />;
    case "rail":
      return <RailSidebar />;
    case "drawer":
      return <DrawerSidebar />;
    default: {
      const exhaustive: never = layout;

      return exhaustive;
    }
  }
};

export const Sidebar = () => {
  const { breakpoint } = useSidebarBreakpointContext();
  const layout = useSidebarLayout(breakpoint);
  const { isModalOpen, setModalState } = useAllRipplesModalState();

  useSearchHotkey({ enabled: useCanSearch() });

  return (
    <>
      <SidebarForLayout layout={layout} />
      {/* Once per app: the drawer and the rail can both be mounted. */}
      <AllRipplesModal open={isModalOpen} onChange={setModalState} />
    </>
  );
};
