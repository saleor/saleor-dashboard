import { Box, Drawer } from "@saleor/macaw-ui-next";
import { type ReactNode, useCallback, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { useHistory } from "react-router";

import { followSidebarLink } from "./followSidebarLink";
import styles from "./SidebarDrawer.module.css";
import { useDrawerSwipe } from "./useDrawerSwipe";

const messages = defineMessages({
  closeNavigation: {
    id: "rU/Mqz",
    defaultMessage: "Close navigation",
    description: "aria-label, button closing the main nav drawer",
  },
});

/** Macaw's Drawer cannot be closed from code; a new key remounts it closed. */
export const useDrawerRemount = (): { key: number; close: () => void } => {
  const [key, setKey] = useState(0);
  const close = useCallback(() => setKey(current => current + 1), []);

  return { key, close };
};

interface SidebarDrawerContentProps {
  /** Called once the panel has slid away after a swipe or a followed link. */
  onClose: () => void;
  children: ReactNode;
}

export const SidebarDrawerContent = ({ onClose, children }: SidebarDrawerContentProps) => {
  const intl = useIntl();
  const history = useHistory();
  const { swipeHandlers, dismiss } = useDrawerSwipe({ onDismiss: onClose });
  const closeLabel = intl.formatMessage(messages.closeNavigation);

  // A callback ref, as the portalled content attaches a commit after this component mounts.
  const handleContentMount = useCallback(
    (content: HTMLDivElement | null) => {
      if (!content) {
        return;
      }

      // Macaw renders its close button right after the content, without an accessible name.
      if (content.nextElementSibling instanceof HTMLButtonElement) {
        content.nextElementSibling.setAttribute("aria-label", closeLabel);
      }

      content
        .querySelector('[aria-current="page"]')
        ?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    },
    [closeLabel],
  );

  return (
    <Drawer.Content
      className={styles.panel}
      backgroundColor="default2"
      data-test-id="sidebar-drawer-content"
      paddingTop={0}
      {...swipeHandlers}
      // The drawer covers the page, so it gets out of the way once a link is followed.
      onClickCapture={event => {
        if (event.target instanceof Element && event.target.closest("a")) {
          followSidebarLink(event, history);
          dismiss(event.currentTarget);
        }
      }}
    >
      <Box ref={handleContentMount} height="100%">
        {children}
      </Box>
    </Drawer.Content>
  );
};
