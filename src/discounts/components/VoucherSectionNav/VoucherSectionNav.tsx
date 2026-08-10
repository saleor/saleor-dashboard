import {
  DetailSection,
  DetailSectionNav,
  type DetailSectionNavItem,
} from "@dashboard/components/DetailSectionNav/DetailSectionNav";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { voucherSectionNavMessages as messages } from "./messages";
import { type VoucherSectionId } from "./voucherSectionIds";

export type VoucherSectionNavItem = DetailSectionNavItem & { id: VoucherSectionId };

interface VoucherSectionNavProps {
  items: VoucherSectionNavItem[];
  activeId?: VoucherSectionId;
  onSelect: (sectionId: VoucherSectionId) => void;
}

export const VoucherSectionNav = ({
  items,
  activeId,
  onSelect,
}: VoucherSectionNavProps): ReactNode => {
  const intl = useIntl();

  return (
    <DetailSectionNav
      items={items}
      activeId={activeId}
      onSelect={sectionId => onSelect(sectionId as VoucherSectionId)}
      ariaLabel={intl.formatMessage(messages.navAriaLabel)}
      data-test-id="voucher-section-nav"
    />
  );
};

export const VoucherSection = ({
  id,
  children,
}: {
  id: VoucherSectionId;
  children: ReactNode;
}): ReactNode => <DetailSection id={id}>{children}</DetailSection>;
