import { Input as MacawInput } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ComponentProps, forwardRef } from "react";

import styles from "./InputWithPlaceholder.module.css";

export const InputWithPlaceholder = forwardRef<HTMLInputElement, ComponentProps<typeof MacawInput>>(
  ({ className, ...props }, ref) => {
    return (
      <MacawInput {...props} className={clsx(styles.inputWithPlaceholder, className)} ref={ref} />
    );
  },
);

InputWithPlaceholder.displayName = "InputWithPlaceholder";
