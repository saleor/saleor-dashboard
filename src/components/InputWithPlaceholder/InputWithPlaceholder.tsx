import { Input as MacawInput } from "@saleor/macaw-ui-next";
import { ComponentProps, forwardRef } from "react";

import styles from "./InputWithPlaceholder.module.css";

export const InputWithPlaceholder = forwardRef<HTMLInputElement, ComponentProps<typeof MacawInput>>(
  (props, ref) => {
    return <MacawInput className={styles.inputWithPlaceholder} {...props} ref={ref} />;
  },
);

InputWithPlaceholder.displayName = "InputWithPlaceholder";
