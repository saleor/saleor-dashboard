import { vars } from "@saleor/macaw-ui-next";
import * as React from "react";

import styles from "./CardSpacer.module.css";

interface CardSpacerProps {
  children?: React.ReactNode;
  backgroundColor?: keyof typeof vars.colors.background;
}

export const CardSpacer = ({ children, backgroundColor = "default1" }: CardSpacerProps) => {
  return (
    <div
      className={styles.spacer}
      style={{
        backgroundColor: vars.colors.background[backgroundColor],
      }}
    >
      {children}
    </div>
  );
};
CardSpacer.displayName = "CardSpacer";
export default CardSpacer;
