import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Avatar, Box, Drawer, Text, Tooltip } from "@saleor/macaw-ui-next";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { type MouseEvent, type RefObject, useLayoutEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { RAIL_OVERLAY_OFFSET } from "./menu/RailItem";
import { useLabelTooltip } from "./menu/useLabelTooltip";
import { useTooltipSuppression } from "./menu/useTooltipSuppression";
import { rippleSidebarCollapse } from "./ripples/sidebarCollapse";
import { ShortcutItem } from "./shortcuts/ShortcutItem";
import { getShortcutLeadingKey } from "./shortcuts/utils";
import { sidebarCollapseMessages as messages } from "./sidebarCollapseMessages";
import styles from "./SidebarCollapseToggle.module.css";
import { useSidebarCollapse } from "./SidebarContext";
import { sidebarDrawerTriggerMessages } from "./sidebarDrawerTriggerMessages";
import { useSidebarCollapseToggle } from "./useSidebarCollapseToggle";

const iconProps = { size: iconSize.small, strokeWidth: iconStrokeWidthBySize.small } as const;

/**
 * The toggle icons show what they do, so the tooltip mostly teaches the shortcut. It waits for a
 * deliberate hover and goes quiet once the viewer has used the shortcut.
 */
const TOGGLE_TOOLTIP_DELAY_MS = 700;

const useToggleTooltip = (): ReturnType<typeof useLabelTooltip> => {
  const { knowsCollapseShortcut } = useSidebarCollapse();

  return useLabelTooltip({ hidden: knowsCollapseShortcut });
};

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
  const tooltip = useToggleTooltip();
  const label = intl.formatMessage(messages.collapseNavigation);

  return (
    <Box position="relative" display="flex">
      <Tooltip {...tooltip.rootProps} delayDuration={TOGGLE_TOOLTIP_DELAY_MS}>
        <Tooltip.Trigger>
          <button
            ref={ref}
            type="button"
            className={styles.collapseButton}
            aria-label={label}
            onClick={onClick}
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
  const tooltip = useToggleTooltip();
  const label = intl.formatMessage(messages.expandNavigation);

  return (
    <Tooltip {...tooltip.rootProps} delayDuration={TOGGLE_TOOLTIP_DELAY_MS}>
      <Tooltip.Trigger>
        <button
          ref={ref}
          type="button"
          className={styles.expandButton}
          aria-label={label}
          onClick={onClick}
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

/**
 * Where the full sidebar does not fit beside the page, the rail is fixed and the logo opens the
 * full navigation over the page instead. Must render inside a `Drawer`.
 */
export const SidebarDrawerOpenButton = ({ logo }: { logo: string }) => {
  const intl = useIntl();
  const suppression = useTooltipSuppression();
  const tooltip = useLabelTooltip({ hidden: suppression.isSuppressed });
  const { trackEvent } = useAnalytics();
  const label = intl.formatMessage(sidebarDrawerTriggerMessages.openNavigation);

  return (
    <Tooltip {...tooltip.rootProps} delayDuration={150}>
      {/* Macaw triggers only forward children, so each needs its own element to attach to. */}
      <Tooltip.Trigger>
        <span className={styles.triggerAnchor}>
          <Drawer.Trigger>
            <button
              type="button"
              className={styles.expandButton}
              aria-label={label}
              onClick={() => {
                suppression.suppress();
                trackEvent("sidebar_drawer_opened", { layout: "rail" });
              }}
              {...suppression.triggerProps}
              data-test-id="sidebar-drawer-open"
            >
              <ExpandButtonFace logo={logo} />
            </button>
          </Drawer.Trigger>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={RAIL_OVERLAY_OFFSET}>
        <Text size={2} fontWeight="medium" __whiteSpace="nowrap">
          {label}
        </Text>
      </Tooltip.Content>
    </Tooltip>
  );
};
