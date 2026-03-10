import { FocusEvent, InputHTMLAttributes, ReactNode, forwardRef } from "react";

import { classNames } from "~/utils";

import { Box, PropsWithBox, Text, convertSizeToScale } from "..";
import { InputVariants, helperTextRecipe, inputRecipe } from "../BaseInput";

import { InputWrapper, useStateEvents } from "./InputWrapper";
import { checkIfValidNumberInput } from "./helpers";

export type InputProps = PropsWithBox<
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "color" | "width" | "height" | "size" | "type" | "children" | "nonce"
  > & {
    label?: ReactNode;
    error?: boolean;
    type?:
      | "text"
      | "number"
      | "url"
      | "email"
      | "password"
      | "date"
      | "time"
      | "datetime-local";
    helperText?: ReactNode;
    endAdornment?: ReactNode;
  }
> &
  InputVariants;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      disabled = false,
      className,
      value,
      label,
      id,
      type,
      error = false,
      onChange,
      helperText,
      onBlur,
      onFocus,
      flex,
      flexBasis,
      flexGrow,
      flexShrink,
      width,
      endAdornment,
      ...props
    },
    ref
  ) => {
    const {
      handlers,
      value: inputValue,
      active,
      typed,
    } = useStateEvents(value, type, onChange);

    return (
      <Box
        display="flex"
        flexDirection="column"
        flex={flex}
        flexBasis={flexBasis}
        flexGrow={flexGrow}
        flexShrink={flexShrink}
        width={width}
      >
        <InputWrapper
          id={id}
          typed={typed}
          active={active}
          disabled={disabled}
          size={size}
          label={label}
          error={error}
          className={className}
          endAdornment={endAdornment}
        >
          <Box
            id={id}
            as="input"
            type={type}
            className={classNames(inputRecipe({ size, error }))}
            disabled={disabled}
            value={inputValue}
            ref={ref}
            onBlur={(event: FocusEvent<HTMLInputElement, Element>) => {
              handlers.onBlur();
              onBlur?.(event);
            }}
            onFocus={(event: FocusEvent<HTMLInputElement, Element>) => {
              handlers.onFocus();
              onFocus?.(event);
            }}
            onChange={handlers.onChange}
            onKeyDown={(event) => {
              if (type === "number") {
                checkIfValidNumberInput(event);
              }
            }}
            role="input"
            {...props}
          />
        </InputWrapper>
        {helperText && (
          <Box className={helperTextRecipe({ size })}>
            <Text
              size={convertSizeToScale(size)}
              color={error ? "critical1" : "default2"}
            >
              {helperText}
            </Text>
          </Box>
        )}
      </Box>
    );
  }
);

Input.displayName = "Input";
