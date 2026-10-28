import { AllRipplesModal } from "@dashboard/ripples/components/AllRipplesModal";
import { useAllRipplesModalState } from "@dashboard/ripples/state";
import { Drawer } from "@saleor/macaw-ui-next";
import { useHotkeys } from "react-hotkeys-hook";

import { SidebarContent } from "./Content";
import classes from "./Sidebar.module.css";
import { useSidebarBreakpointContext, useSidebarCollapse } from "./SidebarContext";
import { SidebarDrawerTrigger } from "./SidebarDrawerTrigger";
import { useSidebarCollapseToggle } from "./useSidebarCollapseToggle";
import { type SidebarLayout, useSidebarLayout } from "./useSidebarLayout";

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

const DrawerSidebar = () => (
  <Drawer>
    <Drawer.Trigger>
      <SidebarDrawerTrigger />
    </Drawer.Trigger>
    <Drawer.Content
      backgroundColor="default2"
      data-test-id="sidebar-drawer-content"
      paddingTop={0}
      __width="260px"
    >
      <SidebarContent />
    </Drawer.Content>
  </Drawer>
);

const SidebarForLayout = ({ layout }: { layout: SidebarLayout }) => {
  switch (layout) {
    case "column":
      return <PersistentSidebar />;
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

  return (
    <>
      <SidebarForLayout layout={layout} />
      <AllRipplesModal open={isModalOpen} onChange={setModalState} />
    </>
  );
};
