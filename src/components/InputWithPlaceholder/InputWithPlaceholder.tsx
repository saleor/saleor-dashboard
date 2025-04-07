import { Input as MacawInput } from "@saleor/macaw-ui-next";
import React, { ComponentProps } from "react";

import styles from "./InputWithPlaceholder.module.css";

export const InputWithPlaceholder = (props: ComponentProps<typeof MacawInput>) => {
  return <MacawInput className={styles.inputWithPlaceholder} {...props} />;
};
