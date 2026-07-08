import { Box, Modal, type PropsWithBox } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { cloneElement, isValidElement, type ReactNode } from "react";

import styles from "./DashboardModal.module.css";
import { getLayoutChildren, getLayoutWrapper } from "./getLayoutChildren";
import { isRadixPortaledContent } from "./isRadixPortaledContent";
import {
  MODAL_ACTIONS_DISPLAY_NAME,
  MODAL_BODY_DISPLAY_NAME,
  MODAL_CHROME_DISPLAY_NAMES,
} from "./modalDisplayNames";
import { ModalLayoutContextProvider } from "./modalLayoutContext";

export type ContentSize = "xs" | "sm" | "picker" | "md" | "lg" | "xl";

type ContentProps = PropsWithBox<{
  children: ReactNode;
  disableAutofocus?: boolean;
  disableEscapeKeyDown?: boolean;
  /** Keep children as-is when the modal manages its own scroll regions (e.g. nested forms). */
  disableScrollLayout?: boolean;
  size: ContentSize;
}>;

const sizes: Record<ContentSize, number> = {
  xs: 444,
  sm: 600,
  picker: 720,
  md: 960,
  lg: 1280,
  xl: 1920,
};

const getComponentDisplayName = (type: unknown): string | undefined => {
  if (typeof type === "function" || (typeof type === "object" && type !== null)) {
    return (type as { displayName?: string }).displayName;
  }

  return undefined;
};

const isModalComponent = (child: ReactNode, displayName: string): boolean => {
  return isValidElement(child) && getComponentDisplayName(child.type) === displayName;
};

const isChromeComponent = (child: ReactNode): boolean => {
  return MODAL_CHROME_DISPLAY_NAMES.some(displayName => isModalComponent(child, displayName));
};

const wrapLayoutContent = (children: ReactNode, content: ReactNode): ReactNode => {
  const wrapper = getLayoutWrapper(children);

  if (wrapper) {
    return cloneElement(wrapper, wrapper.props, content);
  }

  return content;
};

const findLastModalChildIndex = (items: ReactNode[], displayName: string): number => {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (isModalComponent(items[index], displayName)) {
      return index;
    }
  }

  return -1;
};

export const Content = ({
  children,
  disableAutofocus,
  disableEscapeKeyDown,
  disableScrollLayout = false,
  size,
  className,
  ...rest
}: ContentProps) => {
  const items = getLayoutChildren(children);
  const hasBody = items.some(child => isModalComponent(child, MODAL_BODY_DISPLAY_NAME));
  const actionsIndex = findLastModalChildIndex(items, MODAL_ACTIONS_DISPLAY_NAME);
  const actionsChild = actionsIndex >= 0 ? items[actionsIndex] : null;
  const contentItems =
    actionsChild !== null ? items.filter((_, index) => index !== actionsIndex) : items;
  const chromeItems = contentItems.filter(isChromeComponent);
  const scrollItems = contentItems.filter(child => !isChromeComponent(child));
  const isHeaderOnlyDialog =
    !hasBody && scrollItems.length === 0 && chromeItems.length > 0 && actionsChild !== null;

  const renderedContent = disableScrollLayout ? (
    children
  ) : hasBody ? (
    wrapLayoutContent(children, contentItems)
  ) : scrollItems.length > 0 ? (
    <>
      {chromeItems}
      <Box className={styles.scrollBody} flexGrow="1" overflowY="auto" __minHeight="0">
        {wrapLayoutContent(children, scrollItems)}
      </Box>
    </>
  ) : (
    wrapLayoutContent(children, contentItems)
  );

  const pinnedActions = disableScrollLayout ? null : actionsChild;
  const layoutMain =
    hasBody && pinnedActions ? (
      <Box className={styles.contentMain}>{renderedContent}</Box>
    ) : (
      renderedContent
    );

  return (
    <Modal.Content
      disableAutofocus={disableAutofocus}
      dialogContentProps={{
        onPointerDownOutside: e => {
          // This fixes issues when cursor was clicked on DataGrid x/y coordinates
          // For example: when in modal clicked on "View metadata" button in DataGrid
          if (isRadixPortaledContent(e.target)) {
            e.preventDefault();

            return;
          }

          e.detail.originalEvent.preventDefault();
        },
        onInteractOutside: e => {
          // Prevent modal from closing when interacting with popovers (e.g., filter dropdowns)
          // Popovers render in portals outside the modal's DOM tree, so Radix treats them as "outside"
          if (isRadixPortaledContent(e.target)) {
            e.preventDefault();
          }
        },
        onEscapeKeyDown: disableEscapeKeyDown ? e => e.preventDefault() : undefined,
      }}
    >
      <Box
        backgroundColor="default1"
        boxShadow="defaultModal"
        borderRadius={4}
        position="fixed"
        __left="50%"
        __top="50%"
        __transform="translate(-50%, -50%)"
        borderStyle="solid"
        borderWidth={1}
        borderColor="default1"
        __maxHeight="calc(100vh - 100px)"
        __width="calc(100% - 64px)"
        display="flex"
        flexDirection="column"
        __minHeight="0"
        __maxWidth={sizes[size]}
        className={clsx(
          styles.contentShell,
          !hasBody && styles.contentShellNoBody,
          isHeaderOnlyDialog && styles.contentShellHeaderOnly,
          className,
        )}
        {...rest}
      >
        <ModalLayoutContextProvider isHeaderOnly={isHeaderOnlyDialog}>
          {layoutMain}
          {pinnedActions}
        </ModalLayoutContextProvider>
      </Box>
    </Modal.Content>
  );
};
