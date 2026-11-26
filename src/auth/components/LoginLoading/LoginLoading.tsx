import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import { type ReactNode } from "react";

import styles from "./LoginLoading.module.css";

export const LoginLoading = (): ReactNode => (
  <div className={styles.root} aria-busy="true">
    <SaleorThrobber size={48} />
  </div>
);

LoginLoading.displayName = "LoginLoading";
