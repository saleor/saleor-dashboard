import { Box, List, Popover, sprinkles, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type KeyboardEvent, type MouseEvent, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { followSidebarLink } from "../followSidebarLink";
import styles from "./RailGroup.module.css";
import { RAIL_OVERLAY_OFFSET, RailItem } from "./RailItem";
import { SubmenuItems } from "./SubmenuItems";
import { type SidebarMenuItem } from "./types";
import { useTooltipSuppression } from "./useTooltipSuppression";
import { getRailFlyoutChildren, isMenuActive, shouldLinkGroupInFlyout } from "./utils";

interface RailGroupProps {
  menuItem: SidebarMenuItem;
  icon: React.ReactNode;
}

export const RailGroup = ({ menuItem, icon }: RailGroupProps) => {
  const location = useLocation();
  const history = useHistory();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const tooltip = useTooltipSuppression();
  const triggerRef = useRef<HTMLButtonElement>(null);
  // A pointer choice must not focus the trigger: focus() scrolls the window to the sidebar.
  const openedWithPointer = useRef(false);

  // Navigation pins are distinguished by query string, so the search has to travel along.
  const activeLocation = location.pathname + location.search;
  const children = getRailFlyoutChildren(menuItem);
  const hasSubmenuActive = children.some(child => isMenuActive(activeLocation, child));
  const isGroupPageActive = isMenuActive(activeLocation, menuItem) && !hasSubmenuActive;
  const linkHeading = shouldLinkGroupInFlyout(menuItem);

  const handleOpenChange = (nextOpen: boolean): void => {
    setOpen(nextOpen);

    if (!nextOpen) {
      tooltip.suppress();
    }
  };

  const closeAfterNavigation = (event: MouseEvent<HTMLElement>): void => {
    if (followSidebarLink(event, history)) {
      handleOpenChange(false);
    }
  };
  const markPointerOpen = (): void => {
    openedWithPointer.current = true;
  };
  const markKeyboardOpen = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      openedWithPointer.current = false;
    }
  };
  // Opening with a pointer must not move focus into the flyout, or the window scrolls to the sidebar.
  const skipPointerAutoFocus = (event: Event): void => {
    if (openedWithPointer.current) {
      event.preventDefault();
    }
  };
  // Macaw's types omit this Radix prop, but the component forwards it.
  const closeAutoFocusProps: { onCloseAutoFocus: (event: Event) => void } = {
    onCloseAutoFocus: event => {
      event.preventDefault();

      if (!openedWithPointer.current) {
        triggerRef.current?.focus({ preventScroll: true });
      }
    },
  };
  const heading = (
    <Text size={2} fontWeight="medium" color={linkHeading ? "default1" : "default2"}>
      {menuItem.label}
    </Text>
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <RailItem
        label={menuItem.label}
        icon={icon}
        active={isGroupPageActive || hasSubmenuActive || open}
        adornment={menuItem.endAdornment}
        hideTooltip={open || tooltip.isSuppressed}
        dataTestId={`menu-item-label-${menuItem.id}`}
      >
        {content => (
          <Popover.Trigger>
            <button
              ref={triggerRef}
              type="button"
              {...tooltip.triggerProps}
              onPointerDown={markPointerOpen}
              onKeyDown={markKeyboardOpen}
              data-test-id={`menu-rail-group-${menuItem.id}`}
            >
              {content}
            </button>
          </Popover.Trigger>
        )}
      </RailItem>
      <Popover.Content
        side="right"
        align="start"
        sideOffset={RAIL_OVERLAY_OFFSET}
        alignOffset={-8}
        onOpenAutoFocus={skipPointerAutoFocus}
        {...closeAutoFocusProps}
      >
        <Box
          className={clsx(styles.flyout, theme === "defaultDark" && styles.flyoutDark)}
          onClickCapture={closeAfterNavigation}
          data-test-id={`menu-rail-flyout-${menuItem.id}`}
        >
          {linkHeading ? (
            <List.Item
              borderRadius={3}
              paddingX={2}
              active={isGroupPageActive}
              onClick={menuItem.onClick}
            >
              <Link
                to={menuItem.url ?? ""}
                replace={isGroupPageActive}
                className={sprinkles({ display: "block", width: "100%", paddingY: 1.5 })}
              >
                {heading}
              </Link>
            </List.Item>
          ) : (
            <Box paddingX={2} paddingY={1.5}>
              {heading}
            </Box>
          )}
          <List as="ul" display="flex" flexDirection="column" gap="px" marginTop={0.5}>
            <SubmenuItems items={children} />
          </List>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
