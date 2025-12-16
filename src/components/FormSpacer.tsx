import * as React from "react";

import styles from "./FormSpacer.module.css";

interface FormSpacerProps {
  children?: React.ReactNode;
}

export const FormSpacer = (props: FormSpacerProps) => {
  const { children } = props;

  return <div className={styles.spacer}>{children}</div>;
};

FormSpacer.displayName = "FormSpacer";
export default FormSpacer;
