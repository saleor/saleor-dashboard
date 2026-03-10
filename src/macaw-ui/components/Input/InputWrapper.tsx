/*
  Do not expose this file, it's for internal purposes only.
*/
import { ReactNode, useState } from "react";

import { Box } from "~/components";
import { classNames } from "~/utils";
import { LabelVariants, labelRecipe, spanRecipe } from "../BaseInput";

import { InputProps } from "./Input";
import { isInputTyped } from "./helpers";
import { ChangeHandler, InputValue } from "./types";

export const useStateEvents = (
  value: InputValue,
  type: InputProps["type"],
  changeHandler?: ChangeHandler
) => {
  const [active, setActive] = useState(false);
  const typed = isInputTyped(type, value, active);

  const onFocus = () => setActive(true);
  const onBlur = () => setActive(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (changeHandler) {
      changeHandler(event);
    }
  };

  return {
    handlers: { onFocus, onBlur, onChange },
    value,
    active,
    typed,
  };
};

type InputWrapperProps = LabelVariants & {
  id?: string;
  label?: ReactNode;
  className?: string;
  error?: boolean;
  children: ReactNode;
  endAdornment?: ReactNode;
};

export const InputWrapper = ({
  children,
  id,
  typed,
  active,
  disabled,
  size,
  label,
  error,
  className,
  endAdornment,
}: InputWrapperProps) => {
  return (
    <Box
      as="label"
      htmlFor={id}
      className={classNames(
        labelRecipe({ typed, active, disabled, size, error }),
        className
      )}
      alignItems="center"
      gap={1}
      data-macaw-ui-component="Input"
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
      {endAdornment}
    </Box>
  );
};
InputWrapper.displayName = "InputWrapper";
