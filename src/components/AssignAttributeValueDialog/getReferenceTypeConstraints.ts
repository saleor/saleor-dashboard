import { type InitialPageConstraints } from "../ModalFilters/entityConfigs/ModalPageFilterProvider";
import { type InitialConstraints } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";

type ReferenceType =
  | { __typename: "ProductType"; id: string; name: string }
  | { __typename: "PageType"; id: string; name: string };

/**
 * Builds locked filter constraints for AssignAttributeValueDialog from a reference
 * attribute's `referenceTypes`. Without these constraints the dialog's filter
 * provider refetches entities unrestricted, letting the user pick references the
 * backend will reject on save.
 */
export const getReferenceTypeConstraints = (
  referenceTypes: ReferenceType[] | null | undefined,
): (InitialConstraints & InitialPageConstraints) | undefined => {
  if (!referenceTypes?.length) {
    return undefined;
  }

  const productTypeRefs = referenceTypes.filter(
    (t): t is Extract<ReferenceType, { __typename: "ProductType" }> =>
      t?.__typename === "ProductType" && Boolean(t?.id),
  );

  const pageTypeRefs = referenceTypes.filter(
    (t): t is Extract<ReferenceType, { __typename: "PageType" }> =>
      t?.__typename === "PageType" && Boolean(t?.id),
  );

  if (productTypeRefs.length === 0 && pageTypeRefs.length === 0) {
    return undefined;
  }

  return {
    ...(productTypeRefs.length > 0 && {
      productTypes: productTypeRefs.map(t => ({ id: t.id, name: t.name })),
    }),
    ...(pageTypeRefs.length > 0 && {
      pageTypes: pageTypeRefs.map(t => ({ id: t.id, name: t.name })),
    }),
  };
};
