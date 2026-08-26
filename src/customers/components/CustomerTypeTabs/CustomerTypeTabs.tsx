import {
  ALL_MODELS_TAB_ID,
  type ModelTypeTabCount,
  ModelTypeTabs,
} from "@dashboard/modeling/components/ModelTypeTabs/ModelTypeTabs";
import { type ReactNode } from "react";

export const ALL_CUSTOMERS_TAB_ID = ALL_MODELS_TAB_ID;

/** Same localStorage key the customer list tabs use for pinned types. */
export const CUSTOMER_TYPE_TABS_PIN_STORAGE_KEY = "customerTypeTabs.pinnedIds";

export type CustomerTypeTabCount = ModelTypeTabCount;

interface CustomerTypeTabItem {
  id: string;
  name: string;
}

interface CustomerTypeTabsProps {
  customerTypes: CustomerTypeTabItem[] | undefined;
  selectedIds: string[];
  counts: Record<string, CustomerTypeTabCount | undefined>;
  onTabChange: (ids: string[]) => void;
  rightSlot?: ReactNode;
}

/**
 * Type tabs for the customer list. Same strip as models, without name-splitting
 * grouping — pass a grouping object into ModelTypeTabs later to turn that on.
 */
export const CustomerTypeTabs = ({
  customerTypes,
  selectedIds,
  counts,
  onTabChange,
  rightSlot,
}: CustomerTypeTabsProps): JSX.Element => (
  <ModelTypeTabs
    pageTypes={customerTypes}
    selectedIds={selectedIds}
    counts={counts}
    onTabChange={onTabChange}
    grouping={false}
    pinStorageKey={CUSTOMER_TYPE_TABS_PIN_STORAGE_KEY}
    testId="customer-type-tabs"
    testIdPrefix="customer-type-tab"
    rightSlot={rightSlot}
  />
);

CustomerTypeTabs.displayName = "CustomerTypeTabs";
