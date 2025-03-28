import { useState } from "react";

import { VoucherCreatePageTab } from "../types";

export const useActiveTab = () => {
  const [activeTab, setActiveTab] = useState<VoucherCreatePageTab>(VoucherCreatePageTab.categories);

  const changeTab = (tab: VoucherCreatePageTab, reset: () => void) => {
    reset();
    setActiveTab(tab);
  };

  return {
    activeTab,
    changeTab,
  };
};
