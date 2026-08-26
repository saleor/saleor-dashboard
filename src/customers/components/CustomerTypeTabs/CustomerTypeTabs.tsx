import {
  ALL_MODELS_TAB_ID,
  type ModelTypeTabCount,
  ModelTypeTabs,
} from "@dashboard/modeling/components/ModelTypeTabs/ModelTypeTabs";
import { type ReactNode } from "react";

export const ALL_CUSTOMERS_TAB_ID = ALL_MODELS_TAB_ID;

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
    pinStorageKey="customerTypeTabs.pinnedIds"
    testId="customer-type-tabs"
    testIdPrefix="customer-type-tab"
    rightSlot={rightSlot}
  />
);

CustomerTypeTabs.displayName = "CustomerTypeTabs";
