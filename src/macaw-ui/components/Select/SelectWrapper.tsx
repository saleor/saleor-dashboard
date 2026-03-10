/*
  Do not expose this file, it's for internal purposes only.
*/
import { UseSelectPropGetters } from "downshift";
import { ReactNode } from "react";

import { classNames } from "~/utils";

import { sprinkles } from "~/theme";
import { LabelVariants, labelRecipe, spanRecipe } from "../BaseInput";
import { Option, toggleIconStyle } from "../BaseSelect";
import { Box } from "../Box";
import { ArrowDownIcon } from "../Icons";
import { useSelect } from "./useSelect";

type SelectWrapperProps = LabelVariants & {
  id?: string;
  label?: ReactNode;
  className?: string;
  error?: boolean;
  children: ReactNode;
  getToggleButtonProps: ReturnType<typeof useSelect>["getToggleButtonProps"];
  getLabelProps: UseSelectPropGetters<Option>["getLabelProps"];
};

export const SelectWrapper = ({
  id,
  label,
  className,
  error,
  children,
  getToggleButtonProps,
  getLabelProps,
  typed,
  active,
  disabled,
  size,
}: SelectWrapperProps) => {
  return (
    <Box
      as="label"
      className={classNames(
        labelRecipe({ typed, active, disabled, size, error }),
        className
      )}
      alignItems="center"
      justifyContent="space-between"
      disabled={disabled}
      flexWrap="nowrap"
      gap={3}
      {...getToggleButtonProps()}
      data-macaw-ui-component="Select"
      cursor={disabled ? "not-allowed" : "pointer"}
    >
      <Box
        display="flex"
        flexDirection="column"
        // Take full width minus the arrow icon width
        __width="calc(100% - 30px)"
      >
        <Box
          as="span"
          className={classNames(spanRecipe({ typed, size, disabled, error }))}
          {...getLabelProps({ htmlFor: id })}
        >
          {label}
        </Box>
        {children}
      </Box>

      <ArrowDownIcon
        className={classNames(
          toggleIconStyle,
          sprinkles({ cursor: "pointer" })
        )}
        size={size}
      />
    </Box>
  );
};

SelectWrapper.displayName = "SelectWrapper";
