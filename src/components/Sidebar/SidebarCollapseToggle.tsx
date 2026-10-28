import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Avatar, Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { type MouseEvent, type RefObject, useLayoutEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { RAIL_OVERLAY_OFFSET } from "./menu/RailItem";
import { useLabelTooltip } from "./menu/useLabelTooltip";
import { rippleSidebarCollapse } from "./ripples/sidebarCollapse";
import { ShortcutItem } from "./shortcuts/ShortcutItem";
import { getShortcutLeadingKey } from "./shortcuts/utils";
import { sidebarCollapseMessages as messages } from "./sidebarCollapseMessages";
import styles from "./SidebarCollapseToggle.module.css";
import { useSidebarCollapseToggle } from "./useSidebarCollapseToggle";

const iconProps = { size: iconSize.small, strokeWidth: iconStrokeWidthBySize.small } as const;

/**
 * Each state renders its own toggle, so toggling unmounts the focused one. Focus follows to the
 * toggle that replaces it in the same commit; after a mouse click focus is left alone, as it
 * would pop the tooltip.
 */
let isFocusHandoffPending = false;

const useToggleButton = (): {
  ref: RefObject<HTMLButtonElement>;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
} => {
  const toggle = useSidebarCollapseToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const wasClickedWithPointer = useRef(false);

  useLayoutEffect(function handOffFocusBetweenToggles() {
    const button = ref.current;

    if (isFocusHandoffPending) {
      isFocusHandoffPending = false;
      button?.focus();
    }

    return () => {
      if (!wasClickedWithPointer.current && button?.contains(document.activeElement)) {
        isFocusHandoffPending = true;
        // Layout effects of the commit run synchronously, so a toggle that does not come back
        // (e.g. the layout changed) must not take focus later.
        queueMicrotask(() => {
          isFocusHandoffPending = false;
        });
      }
    };
  }, []);

  const onClick = (event: MouseEvent<HTMLButtonElement>): void => {
    // Enter and Space dispatch a click without pointer detail.
    wasClickedWithPointer.current = event.detail > 0;
    toggle("button");
  };

  return { ref, onClick };
};

const ToggleTooltipContent = ({ label }: { label: string }) => (
  <Box display="flex" alignItems="center" gap={2} __whiteSpace="nowrap">
    <Text size={2} fontWeight="medium">
      {label}
    </Text>
    <ShortcutItem.KeyboardShortcut>{`${getShortcutLeadingKey()} + B`}</ShortcutItem.KeyboardShortcut>
  </Box>
);

export const SidebarCollapseButton = () => {
  const intl = useIntl();
  const { ref, onClick } = useToggleButton();
  const tooltip = useLabelTooltip();
  const label = intl.formatMessage(messages.collapseNavigation);

  return (
    <Box position="relative" display="flex">
      <Tooltip {...tooltip.rootProps} delayDuration={300}>
        <Tooltip.Trigger>
          <button
            ref={ref}
            type="button"
            className={styles.collapseButton}
            aria-label={label}
            onClick={onClick}
            {...tooltip.triggerProps}
            data-test-id="sidebar-collapse-button"
          >
            <PanelLeftClose {...iconProps} aria-hidden />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="end">
          <ToggleTooltipContent label={label} />
        </Tooltip.Content>
      </Tooltip>
      <span className={styles.ripple}>
        <Ripple model={rippleSidebarCollapse} />
      </span>
    </Box>
  );
};

const ExpandButtonFace = ({ logo }: { logo: string }) => (
  <>
    <span className={styles.logo}>
      <Avatar.Store src={logo} scheme="accent1" size="small" />
    </span>
    <span className={styles.expandIcon}>
      <PanelLeftOpen {...iconProps} aria-hidden />
    </span>
  </>
);

/** In the rail the store logo doubles as the way back; hover or focus reveals the intent. */
export const SidebarExpandButton = ({ logo }: { logo: string }) => {
  const intl = useIntl();
  const { ref, onClick } = useToggleButton();
  const tooltip = useLabelTooltip();
  const label = intl.formatMessage(messages.expandNavigation);

  return (
    <Tooltip {...tooltip.rootProps} delayDuration={150}>
      <Tooltip.Trigger>
        <button
          ref={ref}
          type="button"
          className={styles.expandButton}
          aria-label={label}
          onClick={onClick}
          {...tooltip.triggerProps}
          data-test-id="sidebar-expand-button"
        >
          <ExpandButtonFace logo={logo} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={RAIL_OVERLAY_OFFSET}>
        <ToggleTooltipContent label={label} />
      </Tooltip.Content>
    </Tooltip>
  );
};
