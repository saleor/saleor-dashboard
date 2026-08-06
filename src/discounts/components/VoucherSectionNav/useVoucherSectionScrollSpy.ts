import {
  scrollToDetailSection,
  useDetailSectionScrollSpy,
} from "@dashboard/components/DetailSectionNav/useDetailSectionScrollSpy";

import { type VoucherSectionId } from "./voucherSectionIds";

interface UseVoucherSectionScrollSpyArgs {
  sectionIds: VoucherSectionId[];
  enabled?: boolean;
}

export const scrollToVoucherSection = (sectionId: VoucherSectionId): void => {
  scrollToDetailSection(sectionId);
};

export const useVoucherSectionScrollSpy = ({
  sectionIds,
  enabled = true,
}: UseVoucherSectionScrollSpyArgs) => {
  const { activeId, selectSection } = useDetailSectionScrollSpy({ sectionIds, enabled });

  return {
    activeId: activeId as VoucherSectionId | undefined,
    selectSection: (sectionId: VoucherSectionId) => selectSection(sectionId),
  };
};
