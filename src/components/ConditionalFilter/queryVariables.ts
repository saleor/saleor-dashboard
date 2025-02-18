import {
  AttributeFilterInput,
  AttributeInput,
  CollectionFilterInput,
  CollectionPublished,
  CustomerFilterInput,
  DateRangeInput,
  DateTimeFilterInput,
  DateTimeRangeInput,
  DecimalFilterInput,
  GiftCardFilterInput,
  GlobalIdFilterInput,
  OrderDraftFilterInput,
  PageFilterInput,
  ProductTypeConfigurable,
  ProductTypeFilterInput,
  ProductWhereInput,
  PromotionWhereInput,
  StaffUserInput,
  VoucherFilterInput,
} from "@dashboard/graphql";

import { FilterContainer } from "./FilterElement";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { isItemOption, isItemOptionArray, isTuple } from "./FilterElement/ConditionValue";

type StaticQueryPart = string | GlobalIdFilterInput | boolean | DecimalFilterInput;

const createStaticQueryPart = (selected: ConditionSelected): StaticQueryPart => {
  if (!selected.conditionValue) return "";

  const { label } = selected.conditionValue;
  const { value } = selected;

  if (label === "lower") {
    return { range: { lte: value } };
  }

  if (label === "greater") {
    return { range: { gte: value } };
  }

  if (isTuple(value) && label === "between") {
    const [gte, lte] = value;

    return { range: { lte, gte } };
  }

  if (isItemOption(value) && ["true", "false"].includes(value.value)) {
    return value.value === "true";
  }

  if (isItemOption(value)) {
    return { eq: value.value };
  }

  if (isItemOptionArray(value)) {
    return { oneOf: value.map(x => x.value) };
  }

  if (typeof value === "string") {
    if (["true", "false"].includes(value)) {
      return value === "true";
    }

    return { eq: value };
  }

  if (Array.isArray(value)) {
    return { eq: value };
  }

  return value;
};

export const mapStaticQueryPartToLegacyVariables = (queryPart: StaticQueryPart) => {
  if (typeof queryPart !== "object") {
    return queryPart;
  }

  if ("range" in queryPart) {
    return queryPart.range;
  }

  if ("eq" in queryPart) {
    return queryPart.eq;
  }

  if ("oneOf" in queryPart) {
    return queryPart.oneOf;
  }

  return queryPart;
};

const getRangeQueryPartByType = (value: [string, string], type: string) => {
  const [gte, lte] = value;

  switch (type) {
    case "datetime.range":
      return { dateTime: { lte, gte } };
    case "date.range":
      return { date: { lte, gte } };
    case "number.range":
    default:
      return { valuesRange: { lte: parseFloat(lte), gte: parseFloat(gte) } };
  }
};

const getQueryPartByType = (value: string, type: string, what: "lte" | "gte") => {
  switch (type) {
    case "datetime":
      return { dateTime: { [what]: value } };
    case "date":
      return { date: { [what]: value } };
    default:
      return { valuesRange: { [what]: parseFloat(value) } };
  }
};

const createAttributeQueryPart = (
  attributeSlug: string,
  selected: ConditionSelected,
): AttributeInput => {
  if (!selected.conditionValue) return { slug: attributeSlug };

  const { label, type } = selected.conditionValue;
  const { value } = selected;

  if (label === "lower" && typeof value === "string") {
    return { slug: attributeSlug, ...getQueryPartByType(value, type, "lte") };
  }

  if (label === "greater" && typeof value === "string") {
    return { slug: attributeSlug, ...getQueryPartByType(value, type, "gte") };
  }

  if (isTuple(value) && label === "between") {
    return {
      slug: attributeSlug,
      ...getRangeQueryPartByType(value, type),
    };
  }

  if (isItemOption(value)) {
    return { slug: attributeSlug, values: [value.originalSlug || value.value] };
  }

  if (isItemOptionArray(value)) {
    return {
      slug: attributeSlug,
      values: value.map(x => x.originalSlug || x.value),
    };
  }

  if (typeof value === "string") {
    return { slug: attributeSlug, values: [value] };
  }

  if (Array.isArray(value)) {
    return { slug: attributeSlug, values: value };
  }

  if (value === "true" || value === "false") {
    return { slug: attributeSlug, boolean: value };
  }

  return value;
};

type ProductQueryVars = ProductWhereInput & { channel?: { eq: string } };

/*
  Map to ProductQueryVars as long as it does not have "where" filter - it would use mostly same keys.
*/
export type OrderQueryVars = ProductQueryVars & { created?: DateTimeRangeInput | DateRangeInput };

export const createProductQueryVariables = (value: FilterContainer): ProductQueryVars => {
  return value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    if (c.isStatic()) {
      p[c.value.value as keyof ProductWhereInput] = createStaticQueryPart(c.condition.selected);
    }

    if (c.isAttribute()) {
      p.attributes = p.attributes || [];
      p.attributes!.push(createAttributeQueryPart(c.value.value, c.condition.selected));
    }

    return p;
  }, {} as ProductWhereInput);
};

export const createDiscountsQueryVariables = (value: FilterContainer): PromotionWhereInput => {
  return value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    p[c.value.value as "endDate" | "startDate"] = createStaticQueryPart(
      c.condition.selected,
    ) as DateTimeFilterInput;

    return p;
  }, {} as PromotionWhereInput);
};

export const createOrderQueryVariables = (value: FilterContainer) => {
  return value.reduce((p: OrderQueryVars, c) => {
    if (typeof c === "string" || Array.isArray(c)) {
      return p;
    }

    if (c.value.type === "metadata") {
      p.metadata = p.metadata || [];

      const [key, value] = c.condition.selected.value as [string, string];

      p.metadata.push({ key, value });

      return p;
    }

    if (c.value.type === "updatedAt" || c.value.type === "created") {
      p[c.value.value as "updatedAt" | "created"] = createStaticQueryPart(c.condition.selected) as
        | DateTimeRangeInput
        | DateRangeInput;

      return p;
    }

    if (c.isStatic()) {
      p[c.value.value as keyof OrderQueryVars] = createStaticQueryPart(c.condition.selected);

      return p;
    }

    return p;
  }, {} as OrderQueryVars);
};

export const creatVoucherQueryVariables = (
  value: FilterContainer,
): { filters: VoucherFilterInput; channel: string | undefined } => {
  let channel: string | undefined;

  const filters = value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    if (c.value.type === "channel") {
      if (isItemOption(c.condition.selected.value)) {
        channel = c.condition.selected.value.slug;
      } else {
        channel = c.condition.selected.value as string;
      }

      return p;
    }

    if (c.value.type === "timesUsed") {
      if (typeof c.condition.selected.value === "string") {
        p["timesUsed"] = {
          gte: Number(c.condition.selected.value),
          lte: Number(c.condition.selected.value),
        };

        return p;
      }
    }

    if (c.value.type === "voucherStatus") {
      p["status"] = mapStaticQueryPartToLegacyVariables(
        createStaticQueryPart(c.condition.selected),
      );

      return p;
    }

    p[c.value.value as keyof VoucherFilterInput] = mapStaticQueryPartToLegacyVariables(
      createStaticQueryPart(c.condition.selected),
    );

    return p;
  }, {} as VoucherFilterInput);

  return {
    channel,
    filters,
  };
};

export const createPageQueryVariables = (value: FilterContainer): PageFilterInput => {
  return value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    p[c.value.value as keyof PageFilterInput] = mapStaticQueryPartToLegacyVariables(
      createStaticQueryPart(c.condition.selected),
    );

    return p;
  }, {} as PageFilterInput);
};

export const creatDraftOrderQueryVariables = (value: FilterContainer): OrderDraftFilterInput => {
  return value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    p[c.value.value as keyof OrderDraftFilterInput] = mapStaticQueryPartToLegacyVariables(
      createStaticQueryPart(c.condition.selected),
    );

    return p;
  }, {} as OrderDraftFilterInput);
};

export const createGiftCardQueryVariables = (value: FilterContainer) => {
  return value.reduce<GiftCardFilterInput>((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    if (c.isStatic()) {
      (p[c.value.value as keyof GiftCardFilterInput] as any) = mapStaticQueryPartToLegacyVariables(
        createStaticQueryPart(c.condition.selected),
      );
    }

    return p;
  }, {} as GiftCardFilterInput);
};

export const createCustomerQueryVariables = (value: FilterContainer): CustomerFilterInput => {
  return value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    if (c.value.type === "numberOfOrders" && c.condition.selected.conditionValue?.label === "is") {
      p["numberOfOrders"] = {
        gte: Number(c.condition.selected.value),
        lte: Number(c.condition.selected.value),
      };

      return p;
    }

    p[c.value.value as keyof CustomerFilterInput] = mapStaticQueryPartToLegacyVariables(
      createStaticQueryPart(c.condition.selected),
    );

    return p;
  }, {} as CustomerFilterInput);
};

type CollectionQueryVars = CollectionFilterInput & { channel?: { eq: string } };

export const createCollectionsQueryVariables = (value: FilterContainer): CollectionQueryVars => {
  return value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    const value = mapStaticQueryPartToLegacyVariables(createStaticQueryPart(c.condition.selected));

    if (c.value.type === "metadata") {
      p.metadata = p.metadata || [];

      const [key, value] = c.condition.selected.value as [string, string];

      p.metadata.push({ key, value });

      return p;
    }

    if (c.value.type === "published") {
      p["published"] = value === true ? CollectionPublished.PUBLISHED : CollectionPublished.HIDDEN;

      return p;
    }

    p[c.value.value as keyof CollectionFilterInput] = value;

    return p;
  }, {} as CollectionQueryVars);
};

export const createProductTypesQueryVariables = (
  value: FilterContainer,
): ProductTypeFilterInput => {
  return value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    const value = mapStaticQueryPartToLegacyVariables(createStaticQueryPart(c.condition.selected));

    if (c.value.type === "typeOfProduct") {
      p["productType"] = value;

      return p;
    }

    if (c.value.type === "configurable") {
      p["configurable"] =
        value === true ? ProductTypeConfigurable.CONFIGURABLE : ProductTypeConfigurable.SIMPLE;

      return p;
    }

    (p[c.value.value as keyof ProductTypeFilterInput] as ProductTypeFilterInput) = value;

    return p;
  }, {} as ProductTypeFilterInput);
};

export const createStaffMembersQueryVariables = (value: FilterContainer): StaffUserInput => {
  return value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    if (c.value.type === "staffMemberStatus") {
      p["status"] = mapStaticQueryPartToLegacyVariables(
        createStaticQueryPart(c.condition.selected),
      );

      return p;
    }

    p[c.value.value as keyof StaffUserInput] = mapStaticQueryPartToLegacyVariables(
      createStaticQueryPart(c.condition.selected),
    );

    return p;
  }, {} as StaffUserInput);
};

export const creatAttributesQueryVariables = (value: FilterContainer): AttributeFilterInput => {
  return value.reduce((p, c) => {
    if (typeof c === "string" || Array.isArray(c)) return p;

    if (c.value.type === "attributeType") {
      p["type"] = mapStaticQueryPartToLegacyVariables(createStaticQueryPart(c.condition.selected));

      return p;
    }

    (p[c.value.value as keyof AttributeFilterInput] as any) = mapStaticQueryPartToLegacyVariables(
      createStaticQueryPart(c.condition.selected),
    );

    return p;
  }, {} as AttributeFilterInput);
};
