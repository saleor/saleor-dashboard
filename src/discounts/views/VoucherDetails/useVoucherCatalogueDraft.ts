import { useCallback, useState } from "react";

import {
  createEmptyVoucherCatalogueDraft,
  stageCatalogueAdd,
  stageCatalogueRemove,
  type VoucherCatalogueDraft,
  type VoucherCatalogueKind,
} from "./voucherCatalogueDraft";

export const useVoucherCatalogueDraft = () => {
  const [draft, setDraft] = useState<VoucherCatalogueDraft>(createEmptyVoucherCatalogueDraft);

  const resetDraft = useCallback(() => {
    setDraft(createEmptyVoucherCatalogueDraft());
  }, []);

  const assignItems = useCallback(
    <T extends { id: string }>(kind: VoucherCatalogueKind, items: T[]) => {
      setDraft(current => ({
        ...current,
        [kind]: stageCatalogueAdd(current[kind] as typeof current.categories, items),
      }));
    },
    [],
  );

  const unassignIds = useCallback((kind: VoucherCatalogueKind, ids: string[]) => {
    setDraft(current => ({
      ...current,
      [kind]: stageCatalogueRemove(current[kind], ids),
    }));
  }, []);

  const setCountryCodes = useCallback((countryCodes: string[]) => {
    setDraft(current => ({
      ...current,
      countryCodes,
    }));
  }, []);

  const unassignCountryCode = useCallback((code: string, baselineCodes: string[]) => {
    setDraft(current => {
      const currentCodes = current.countryCodes ?? baselineCodes;

      return {
        ...current,
        countryCodes: currentCodes.filter(countryCode => countryCode !== code),
      };
    });
  }, []);

  return {
    draft,
    resetDraft,
    assignItems,
    unassignIds,
    setCountryCodes,
    unassignCountryCode,
  };
};
