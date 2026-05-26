import { Box, Skeleton, Text, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Info, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { type KeyboardEvent, type ReactNode, type SyntheticEvent } from "react";

import styles from "./KpiCard.module.css";

export interface KpiDelta {
  value: ReactNode;
  trend: "up" | "down" | "neutral";
}

interface KpiCardProps {
  title: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  subtitle?: ReactNode;
  tooltip?: ReactNode;
  delta?: KpiDelta;
  loading?: boolean;
  active?: boolean;
  onSelect?: () => void;
  dataTestId?: string;
}

const deltaTextColor = {
  up: "success1",
  down: "critical1",
  neutral: "default2",
} as const;

const DeltaIcon = ({ trend }: { trend: KpiDelta["trend"] }): JSX.Element => {
  if (trend === "up") {
    return <TrendingUp size={12} />;
  }

  if (trend === "down") {
    return <TrendingDown size={12} />;
  }

  return <Minus size={12} />;
};

const stopEventPropagation = (event: SyntheticEvent): void => {
  event.stopPropagation();
};

export const KpiCard = ({
  title,
  value,
  icon,
  subtitle,
  tooltip,
  delta,
  loading,
  active,
  onSelect,
  dataTestId,
}: KpiCardProps): JSX.Element => {
  if (loading) {
    return (
      <Box
        borderWidth={1}
        borderStyle="solid"
        borderColor="default1"
        borderRadius={4}
        padding={4}
        display="flex"
        flexDirection="column"
        gap={2}
        data-test-id={dataTestId}
      >
        <Skeleton __width="80px" __height="12px" />
        <Skeleton __width="120px" __height="28px" />
        <Skeleton __width="60%" __height="12px" />
      </Box>
    );
  }

  const interactive = !!onSelect;
  const handleKeyDown = interactive
    ? (event: KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.();
        }
      }
    : undefined;

  return (
    <Box
      borderWidth={1}
      borderStyle="solid"
      borderColor={active ? "accent1" : "default1"}
      borderRadius={4}
      padding={4}
      display="flex"
      flexDirection="column"
      gap={1}
      className={clsx(styles.card, {
        [styles.clickable]: interactive,
        [styles.active]: !!active,
      })}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive && active ? true : undefined}
      data-test-id={dataTestId}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        {icon && (
          <Box display="flex" color="default2" flexShrink="0">
            {icon}
          </Box>
        )}
        <Text size={2} color="default2" fontWeight="medium">
          {title}
        </Text>
        {tooltip && (
          <Box
            display="flex"
            onClick={stopEventPropagation}
            onKeyDown={stopEventPropagation}
            onPointerDown={stopEventPropagation}
            data-test-id="kpi-tooltip-trigger"
          >
            <Tooltip>
              <Tooltip.Trigger>
                <Box display="flex" color="default2" alignItems="center">
                  <Info size={13} />
                </Box>
              </Tooltip.Trigger>
              <Tooltip.Content side="top">
                <Tooltip.Arrow />
                {tooltip}
              </Tooltip.Content>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={7} fontWeight="bold" __lineHeight="1.1">
          {value}
        </Text>

        {(delta || subtitle) && (
          <Box display="flex" alignItems="center" gap={1}>
            {delta && (
              <Box display="flex" alignItems="center" gap={0.5} color={deltaTextColor[delta.trend]}>
                <DeltaIcon trend={delta.trend} />
                <Text size={1} fontWeight="medium" color={deltaTextColor[delta.trend]}>
                  {delta.value}
                </Text>
              </Box>
            )}
            {subtitle && (
              <Text size={1} color="default2">
                {subtitle}
              </Text>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

KpiCard.displayName = "KpiCard";
