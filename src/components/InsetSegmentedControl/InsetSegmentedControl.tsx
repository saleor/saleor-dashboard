import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./InsetSegmentedControl.module.css";

export type InsetSegmentedControlSize = "xs" | "sm" | "md" | "lg";

const SIZE_STYLES = {
  xs: {
    trackPadding: 0.5,
    segmentPaddingX: 1.5,
    segmentPaddingY: 0.5,
    matchButtonHeight: false,
  },
  sm: {
    trackPadding: 0.5,
    segmentPaddingX: 2,
    segmentPaddingY: 1,
    matchButtonHeight: false,
  },
  md: {
    trackPadding: 1,
    segmentPaddingX: 3,
    segmentPaddingY: 0,
    matchButtonHeight: true,
  },
  lg: {
    trackPadding: 1,
    segmentPaddingX: 3,
    segmentPaddingY: 1.5,
    matchButtonHeight: false,
  },
} as const satisfies Record<
  InsetSegmentedControlSize,
  {
    trackPadding: 0.5 | 1;
    segmentPaddingX: 1.5 | 2 | 2.5 | 3;
    segmentPaddingY: 0 | 0.5 | 1 | 1.5;
    matchButtonHeight: boolean;
  }
>;

export interface InsetSegmentedControlOption<T extends string = string> {
  value: T;
  label: ReactNode | ((isActive: boolean) => ReactNode);
  testId?: string;
}

export interface InsetSegmentedControlProps<T extends string = string> {
  options: readonly InsetSegmentedControlOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  size?: InsetSegmentedControlSize;
  "aria-label"?: string;
  className?: string;
  "data-test-id"?: string;
}

export const renderInsetSegmentLabel = (
  label: InsetSegmentedControlOption["label"],
  isActive: boolean,
): ReactNode => {
  if (typeof label === "function") {
    return label(isActive);
  }

  if (typeof label === "string" || typeof label === "number") {
    return insetSegmentLabel(isActive, label);
  }

  return label;
};

export const insetSegmentLabel = (isActive: boolean, children: ReactNode): ReactNode => (
  <Text size={2} fontWeight={isActive ? "bold" : "regular"} color="default1">
    {children}
  </Text>
);

export const InsetSegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  size = "md",
  "aria-label": ariaLabel,
  className,
  "data-test-id": dataTestId,
}: InsetSegmentedControlProps<T>): JSX.Element => {
  const sizeStyles = SIZE_STYLES[size];

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      className={clsx(styles.track, sizeStyles.matchButtonHeight && styles.trackButton, className)}
      padding={sizeStyles.trackPadding}
      data-test-id={dataTestId}
    >
      {options.map(option => {
        const isActive = value !== null && option.value === value;

        return (
          <Box
            key={option.value}
            as="button"
            type="button"
            paddingX={sizeStyles.segmentPaddingX}
            paddingY={sizeStyles.segmentPaddingY}
            className={clsx(styles.segment, sizeStyles.matchButtonHeight && styles.segmentFill, {
              [styles.segmentActive]: isActive,
            })}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            data-test-id={option.testId}
          >
            {renderInsetSegmentLabel(option.label, isActive)}
          </Box>
        );
      })}
    </Box>
  );
};
