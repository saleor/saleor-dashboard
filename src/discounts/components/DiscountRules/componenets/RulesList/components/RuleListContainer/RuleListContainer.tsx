import { type ReactNode } from "react";

import styles from "./RuleListContainer.module.css";

interface RuleListContainerProps {
  children: ReactNode;
}

export const RuleListContainer = ({ children }: RuleListContainerProps): JSX.Element => (
  <div className={styles.grid}>{children}</div>
);
