import { ReactNode } from "react";

import styles from "./FormSpacer.module.css";

interface FormSpacerProps {
  children?: ReactNode;
}

export const FormSpacer = (props: FormSpacerProps) => {
  const { children } = props;

  return <div className={styles.spacer}>{children}</div>;
};
