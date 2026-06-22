import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import {
  type AttributeDetailsQuery,
  AttributeInputTypeEnum,
  AttributeTypeEnum,
} from "@dashboard/graphql";
import isEqual from "lodash/isEqual";
import slugify from "slugify";

type Attribute = NonNullable<AttributeDetailsQuery["attribute"]>;

export interface AttributeUpdateComparableData {
  availableInGrid: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  name: string;
  referenceTypes: string[];
  slug: string;
  storefrontSearchPosition: number;
  unit: string | null;
  valueRequired: boolean;
  visibleInStorefront: boolean;
}

export function getAttributePageInitialForm(
  attribute?: Attribute | null,
  defaultType?: AttributeTypeEnum,
): AttributePageFormData {
  if (!attribute) {
    return {
      availableInGrid: true,
      entityType: null,
      filterableInDashboard: true,
      filterableInStorefront: true,
      inputType: AttributeInputTypeEnum.DROPDOWN,
      metadata: [],
      name: "",
      privateMetadata: [],
      slug: "",
      storefrontSearchPosition: "",
      type: defaultType ?? AttributeTypeEnum.PRODUCT_TYPE,
      valueRequired: true,
      visibleInStorefront: true,
      unit: undefined,
      referenceTypes: [],
    };
  }

  return {
    availableInGrid: attribute.availableInGrid,
    entityType: attribute.entityType,
    filterableInDashboard: attribute.filterableInDashboard,
    filterableInStorefront: attribute.filterableInStorefront,
    inputType: attribute.inputType ?? AttributeInputTypeEnum.DROPDOWN,
    metadata: [],
    name: attribute.name ?? "",
    privateMetadata: [],
    slug: attribute.slug ?? "",
    storefrontSearchPosition: attribute.storefrontSearchPosition.toString(),
    type: attribute.type ?? AttributeTypeEnum.PRODUCT_TYPE,
    valueRequired: !!attribute.valueRequired,
    visibleInStorefront: attribute.visibleInStorefront,
    unit: attribute.unit ?? null,
    referenceTypes:
      attribute.referenceTypes?.map(ref => ({ value: ref.id, label: ref.name })) ?? [],
  };
}

export function getAttributeUpdateComparableData(
  data: AttributePageFormData,
): AttributeUpdateComparableData {
  const parsedStorefrontSearchPosition = parseInt(data.storefrontSearchPosition, 10);

  return {
    availableInGrid: data.availableInGrid,
    filterableInDashboard: data.filterableInDashboard,
    filterableInStorefront: data.filterableInStorefront,
    name: data.name,
    referenceTypes: [...data.referenceTypes.map(ref => ref.value)].sort(),
    slug: data.slug || slugify(data.name).toLowerCase(),
    storefrontSearchPosition: Number.isNaN(parsedStorefrontSearchPosition)
      ? 0
      : parsedStorefrontSearchPosition,
    unit: data.unit ?? null,
    valueRequired: data.valueRequired,
    visibleInStorefront: data.visibleInStorefront,
  };
}

export function isAttributeUpdateFormPristine(
  data: AttributePageFormData,
  initialData: AttributePageFormData,
): boolean {
  return isEqual(
    getAttributeUpdateComparableData(data),
    getAttributeUpdateComparableData(initialData),
  );
}
