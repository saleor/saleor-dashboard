import { type ReactNode } from "react";

import styles from "./AppManageTabs.module.css";

export interface AppManageTabItem<Id extends string> {
  id: Id;
  label: ReactNode;
}

interface AppManageTabsProps<Id extends string> {
  tabs: Array<AppManageTabItem<Id>>;
  activeId: Id;
  onChange: (id: Id) => void;
  ariaLabel: string;
  actions?: ReactNode;
}

export const AppManageTabs = <Id extends string>({
  tabs,
  activeId,
  onChange,
  ariaLabel,
  actions,
}: AppManageTabsProps<Id>) => (
  <div className={styles.row}>
    <div role="tablist" aria-label={ariaLabel} className={styles.tabs}>
      {tabs.map(tab => {
        const isActive = tab.id === activeId;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={styles.tab}
            onClick={() => onChange(tab.id)}
            data-test-id={`app-manage-tab-${tab.id}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </div>
);
