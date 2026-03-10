/*
  Do not expose this file, it's for internal purposes only.
*/
import { ReactNode, useState } from "react";

import { Box } from "~/components";
import { classNames } from "~/utils";
import { LabelVariants, labelRecipe, spanRecipe } from "../BaseInput";

export type TextareaValue = string | number | readonly string[] | undefined;
type ChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;

export const useStateEvents = (
  value: TextareaValue,
  changeHandler?: ChangeHandler
) => {
  const [active, setActive] = useState(false);
  const typed = Boolean(value || active);

  const onFocus = () => setActive(true);
  const onBlur = () => setActive(false);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

type TextareaWrapperProps = LabelVariants & {
  id?: string;
  label?: ReactNode;
  className?: string;
  error?: boolean;
  children: ReactNode;
  endAdornment?: ReactNode;
};

export const TextareaWrapper = ({
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
}: TextareaWrapperProps) => {
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
      data-macaw-ui-component="Textarea"
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
TextareaWrapper.displayName = "TextareaWrapper";
