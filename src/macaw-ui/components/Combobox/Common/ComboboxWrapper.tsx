/*
  Do not expose this file, it's for internal purposes only.
*/
import { UseComboboxPropGetters } from "downshift";
import { ReactNode, forwardRef } from "react";

import { classNames } from "~/utils";

import { sprinkles } from "~/theme";
import { LabelVariants, labelRecipe, spanRecipe } from "../../BaseInput";
import { Option, toggleIconStyle } from "../../BaseSelect";
import { Box } from "../../Box";
import { ArrowDownIcon } from "../../Icons";

type ComboboxWrapperProps = LabelVariants & {
  id?: string;
  label?: ReactNode;
  className?: string;
  error?: boolean;
  children: ReactNode;
  getToggleButtonProps: UseComboboxPropGetters<Option>["getToggleButtonProps"];
  getLabelProps: UseComboboxPropGetters<Option>["getLabelProps"];
};

export const ComboboxWrapper = forwardRef<
  HTMLLabelElement,
  ComboboxWrapperProps
>(
  (
    {
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
    },
    ref
  ) => {
    return (
      <Box
        ref={ref}
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
        data-macaw-ui-component="Combobox"
        {...getLabelProps({ htmlFor: id })}
        cursor={disabled ? "not-allowed" : "text"}
      >
        <Box display="flex" flexDirection="column" width="100%">
          <Box
            as="span"
            className={classNames(spanRecipe({ typed, size, disabled, error }))}
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
          {...getToggleButtonProps({
            disabled,
            onClick: (event) => {
              event.preventDefault();
            },
          })}
        />
      </Box>
    );
  }
);

ComboboxWrapper.displayName = "ComboboxWrapper";
