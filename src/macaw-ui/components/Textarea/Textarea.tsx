import {
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import { classNames } from "~/utils";

import { useAutoHeightTextarea } from "~/hooks/useAutoHeightTextarea";
import { Box, PropsWithBox, Text, convertSizeToScale } from "../..";
import { InputVariants, helperTextRecipe, inputRecipe } from "../BaseInput";

import { TextareaWrapper, useStateEvents } from "./TextareaWrapper";

export type TextareaProps = PropsWithBox<
  Omit<
    InputHTMLAttributes<HTMLTextAreaElement>,
    "color" | "width" | "height" | "size" | "type" | "children" | "nonce"
  > & {
    label?: ReactNode;
    error?: boolean;
    helperText?: ReactNode;
    endAdornment?: ReactNode;
    maxRows?: number;
  }
> &
  InputVariants;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size,
      disabled = false,
      className,
      value,
      label,
      id,
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
      rows = 10,
      maxRows = 20,
      ...props
    },
    ref
  ) => {
    const {
      handlers,
      value: inputValue,
      active,
      typed,
    } = useStateEvents(value, onChange);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutoHeightTextarea(textAreaRef.current, value, rows, maxRows);
    useImperativeHandle(ref, () => textAreaRef.current!);

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
        <TextareaWrapper
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
            as="textarea"
            className={classNames(inputRecipe({ size, error }))}
            style={{
              resize: "none",
            }}
            disabled={disabled}
            value={inputValue}
            ref={textAreaRef}
            onBlur={(event: FocusEvent<HTMLTextAreaElement, Element>) => {
              handlers.onBlur();
              onBlur?.(event);
            }}
            onFocus={(event: FocusEvent<HTMLTextAreaElement, Element>) => {
              handlers.onFocus();
              onFocus?.(event);
            }}
            onChange={handlers.onChange}
            rows={rows}
            {...props}
          />
        </TextareaWrapper>
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

Textarea.displayName = "Textarea";
