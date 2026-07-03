import { Box, Modal, type PropsWithBox } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Children, isValidElement, type ReactNode } from "react";

import styles from "./DashboardModal.module.css";
import { MODAL_ACTIONS_DISPLAY_NAME, MODAL_BODY_DISPLAY_NAME } from "./modalDisplayNames";

export type ContentSize = "xs" | "sm" | "md" | "lg" | "xl";

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

const findLastModalChildIndex = (
  items: ReturnType<typeof Children.toArray>,
  displayName: string,
) => {
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
  const items = Children.toArray(children);
  const hasBody = items.some(child => isModalComponent(child, MODAL_BODY_DISPLAY_NAME));
  const actionsIndex = findLastModalChildIndex(items, MODAL_ACTIONS_DISPLAY_NAME);
  const actionsChild = actionsIndex >= 0 ? items[actionsIndex] : null;
  const contentItems =
    actionsChild !== null ? items.filter((_, index) => index !== actionsIndex) : items;

  const renderedContent = disableScrollLayout ? (
    children
  ) : hasBody ? (
    contentItems
  ) : (
    <Box className={styles.scrollBody} flexGrow="1" overflowY="auto" __minHeight="0">
      {contentItems}
    </Box>
  );

  const pinnedActions = disableScrollLayout ? null : actionsChild;

  return (
    <Modal.Content
      disableAutofocus={disableAutofocus}
      dialogContentProps={{
        onPointerDownOutside: e => {
          // This fixes issues when cursor was clicked on DataGrid x/y coordinates
          // For example: when in modal clicked on "View metadata" button in DataGrid
          e.detail.originalEvent.preventDefault();
        },
        onInteractOutside: e => {
          // Prevent modal from closing when interacting with popovers (e.g., filter dropdowns)
          // Popovers render in portals outside the modal's DOM tree, so Radix treats them as "outside"
          const target = e.target as HTMLElement;

          if (target?.closest("[data-radix-popper-content-wrapper]")) {
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
        padding={6}
        __maxHeight="calc(100vh - 100px)"
        __width="calc(100% - 64px)"
        display="flex"
        flexDirection="column"
        __minHeight="0"
        __maxWidth={sizes[size]}
        overflowX="hidden"
        overflowY="hidden"
        className={clsx(styles.contentShell, className)}
        {...rest}
      >
        {renderedContent}
        {pinnedActions}
      </Box>
    </Modal.Content>
  );
};
