import { Box, List, Text, Tooltip } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./RailItem.module.css";
import { useRailTooltipGroup } from "./RailTooltipGroup";
import { useLabelTooltip } from "./useLabelTooltip";

/** Clears the rail edge so tooltips and flyouts sit beside the column, not over it. */
export const RAIL_OVERLAY_OFFSET = 20;

interface RailItemProps {
  /** Accessible name and tooltip. ReactNode labels must set their own typography. */
  label: ReactNode;
  icon: ReactNode;
  /** Shown after the label in the tooltip, e.g. a keyboard shortcut. */
  hint?: ReactNode;
  active?: boolean;
  /** Small badge on the icon corner (ripple, alert). Rendered outside the control. */
  adornment?: ReactNode;
  hideTooltip?: boolean;
  hidden?: boolean;
  dataTestId?: string;
  /** Renders the focusable control (link or button) around the prepared icon content. */
  children: (content: ReactNode) => ReactNode;
}

export const RailItem = ({
  label,
  icon,
  hint,
  active = false,
  adornment,
  hideTooltip = false,
  hidden = false,
  dataTestId,
  children,
}: RailItemProps) => {
  const tooltipGroup = useRailTooltipGroup();
  const tooltip = useLabelTooltip({
    hidden: hideTooltip,
    onOpenChange: tooltipGroup.onOpenChange,
  });
  const content = (
    <>
      {icon}
      <span className={styles.visuallyHidden}>{label}</span>
    </>
  );

  return (
    <List.Item
      active={active}
      borderRadius={3}
      position="relative"
      className={styles.item}
      data-test-id={dataTestId}
      data-active={active}
      hidden={hidden}
      display={hidden ? "none" : undefined}
    >
      <Tooltip {...tooltip.rootProps} delayDuration={tooltipGroup.delayDuration}>
        <Tooltip.Trigger>
          <span className={styles.control}>{children(content)}</span>
        </Tooltip.Trigger>
        <Tooltip.Content side="right" sideOffset={RAIL_OVERLAY_OFFSET} className={styles.tooltip}>
          <Box display="flex" alignItems="center" gap={2} __whiteSpace="nowrap">
            {typeof label === "string" ? (
              <Text size={2} fontWeight="medium">
                {label}
              </Text>
            ) : (
              label
            )}
            {hint}
          </Box>
        </Tooltip.Content>
      </Tooltip>
      {adornment && <span className={styles.adornment}>{adornment}</span>}
    </List.Item>
  );
};
