import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { voucherSectionNavMessages as messages } from "./messages";
import { type VoucherSectionId, voucherSectionIds } from "./voucherSectionIds";
import { type VoucherSectionNavItem } from "./VoucherSectionNav";

interface UseVoucherSectionNavItemsArgs {
  showCatalogue: boolean;
  showCountries: boolean;
}

export const useVoucherSectionNavItems = ({
  showCatalogue,
  showCountries,
}: UseVoucherSectionNavItemsArgs): VoucherSectionNavItem[] => {
  const intl = useIntl();

  return useMemo(() => {
    const items: VoucherSectionNavItem[] = [
      { id: voucherSectionIds.details, label: intl.formatMessage(messages.details) },
      { id: voucherSectionIds.codes, label: intl.formatMessage(messages.codes) },
      { id: voucherSectionIds.discount, label: intl.formatMessage(messages.discount) },
    ];

    if (showCatalogue) {
      items.push({
        id: voucherSectionIds.catalogue,
        label: intl.formatMessage(messages.catalogue),
      });
    }

    if (showCountries) {
      items.push({
        id: voucherSectionIds.countries,
        label: intl.formatMessage(messages.countries),
      });
    }

    items.push(
      { id: voucherSectionIds.requirements, label: intl.formatMessage(messages.requirements) },
      { id: voucherSectionIds.limits, label: intl.formatMessage(messages.limits) },
    );

    return items;
  }, [intl, showCatalogue, showCountries]);
};

export const resolveVoucherSectionVisibility = (data: {
  discountType: DiscountTypeEnum;
  type: VoucherTypeEnum;
}): { showCatalogue: boolean; showCountries: boolean } => ({
  showCatalogue:
    data.discountType !== DiscountTypeEnum.SHIPPING &&
    data.type === VoucherTypeEnum.SPECIFIC_PRODUCT,
  showCountries: data.discountType === DiscountTypeEnum.SHIPPING,
});

export const getVoucherSectionIds = ({
  showCatalogue,
  showCountries,
}: {
  showCatalogue: boolean;
  showCountries: boolean;
}): VoucherSectionId[] => {
  const ids: VoucherSectionId[] = [
    voucherSectionIds.details,
    voucherSectionIds.codes,
    voucherSectionIds.discount,
  ];

  if (showCatalogue) {
    ids.push(voucherSectionIds.catalogue);
  }

  if (showCountries) {
    ids.push(voucherSectionIds.countries);
  }

  ids.push(voucherSectionIds.requirements, voucherSectionIds.limits);

  return ids;
};
