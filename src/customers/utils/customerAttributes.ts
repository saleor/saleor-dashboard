import { prepareAttributesInput } from "@dashboard/attributes/utils/handlers";
import { type AttributeInput } from "@dashboard/components/Attributes/Attributes";
import {
  AttributeInputTypeEnum,
  type AttributeValueDetailsFragment,
  type AttributeValueInput,
  type CustomerAssignedAttributeFragment,
  type CustomerTypeOnCustomerFragment,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

const asString = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
};

const toSingleValue = (value: string | null | undefined): string[] => (value ? [value] : []);

const hasFilledAttributeValue = (value?: unknown[] | null): boolean =>
  Boolean(value?.some(item => item !== null && item !== undefined && item !== ""));

interface MappedAssignedAttribute {
  additionalData?: Array<{ label: string; value: string }>;
  value: string[];
}

export const mapAssignedAttribute = (
  assigned: CustomerAssignedAttributeFragment,
): MappedAssignedAttribute => {
  switch (assigned.__typename) {
    case "AssignedSingleChoiceAttribute":
      return { value: toSingleValue(assigned.choiceValue?.slug) };
    case "AssignedMultiChoiceAttribute":
      return {
        value: assigned.choiceValues
          .map(choice => choice.slug)
          .filter((slug): slug is string => !!slug),
      };
    case "AssignedSwatchAttribute":
      return { value: toSingleValue(assigned.swatchValue?.slug) };
    case "AssignedPlainTextAttribute":
      return { value: toSingleValue(assigned.plainTextValue) };
    case "AssignedTextAttribute":
      return { value: toSingleValue(asString(assigned.richTextValue)) };
    case "AssignedNumericAttribute":
      return {
        value:
          assigned.numericValue === null || assigned.numericValue === undefined
            ? []
            : [String(assigned.numericValue)],
      };
    case "AssignedBooleanAttribute":
      return {
        // AttributeInput is typed as string[], but boolean rows store a boolean
        // so the select can distinguish true / false / unset.
        value:
          assigned.booleanValue === null || assigned.booleanValue === undefined
            ? []
            : [assigned.booleanValue as unknown as string],
      };
    case "AssignedDateAttribute":
      return { value: toSingleValue(assigned.dateValue) };
    case "AssignedDateTimeAttribute":
      return { value: toSingleValue(asString(assigned.dateTimeValue)) };
    case "AssignedFileAttribute":
      return { value: toSingleValue(assigned.fileValue?.url) };
    case "AssignedSinglePageReferenceAttribute":
      return assigned.pageValue
        ? {
            additionalData: [{ label: assigned.pageValue.title, value: assigned.pageValue.id }],
            value: [assigned.pageValue.id],
          }
        : { value: [] };
    case "AssignedSingleProductReferenceAttribute":
      return assigned.productValue
        ? {
            additionalData: [
              { label: assigned.productValue.name, value: assigned.productValue.id },
            ],
            value: [assigned.productValue.id],
          }
        : { value: [] };
    case "AssignedSingleProductVariantReferenceAttribute":
      return assigned.variantValue
        ? {
            additionalData: [
              { label: assigned.variantValue.name, value: assigned.variantValue.id },
            ],
            value: [assigned.variantValue.id],
          }
        : { value: [] };
    case "AssignedSingleCategoryReferenceAttribute":
      return assigned.categoryValue
        ? {
            additionalData: [
              { label: assigned.categoryValue.name, value: assigned.categoryValue.id },
            ],
            value: [assigned.categoryValue.id],
          }
        : { value: [] };
    case "AssignedSingleCollectionReferenceAttribute":
      return assigned.collectionValue
        ? {
            additionalData: [
              { label: assigned.collectionValue.name, value: assigned.collectionValue.id },
            ],
            value: [assigned.collectionValue.id],
          }
        : { value: [] };
    case "AssignedMultiPageReferenceAttribute":
      return {
        additionalData: assigned.pageValues.map(page => ({
          label: page.title,
          value: page.id,
        })),
        value: assigned.pageValues.map(page => page.id),
      };
    case "AssignedMultiProductReferenceAttribute":
      return {
        additionalData: assigned.productValues.map(product => ({
          label: product.name,
          value: product.id,
        })),
        value: assigned.productValues.map(product => product.id),
      };
    case "AssignedMultiProductVariantReferenceAttribute":
      return {
        additionalData: assigned.variantValues.map(variant => ({
          label: variant.name,
          value: variant.id,
        })),
        value: assigned.variantValues.map(variant => variant.id),
      };
    case "AssignedMultiCategoryReferenceAttribute":
      return {
        additionalData: assigned.categoryValues.map(category => ({
          label: category.name,
          value: category.id,
        })),
        value: assigned.categoryValues.map(category => category.id),
      };
    case "AssignedMultiCollectionReferenceAttribute":
      return {
        additionalData: assigned.collectionValues.map(collection => ({
          label: collection.name,
          value: collection.id,
        })),
        value: assigned.collectionValues.map(collection => collection.id),
      };
    default:
      return { value: [] };
  }
};

const toChoiceDetails = (
  choice: { name?: string | null; slug?: string | null } | null | undefined,
): AttributeValueDetailsFragment | null => {
  if (!choice?.slug) {
    return null;
  }

  const details: AttributeValueDetailsFragment = {
    __typename: "AttributeValue",
    boolean: null,
    date: null,
    dateTime: null,
    file: null,
    id: choice.slug,
    name: choice.name ?? choice.slug,
    plainText: null,
    reference: null,
    richText: null,
    slug: choice.slug,
    value: null,
  };

  return details;
};

const getAssignedSelectedValues = (
  assigned: CustomerAssignedAttributeFragment | undefined,
): AttributeValueDetailsFragment[] | undefined => {
  if (!assigned) {
    return undefined;
  }

  switch (assigned.__typename) {
    case "AssignedSingleChoiceAttribute": {
      const value = toChoiceDetails(assigned.choiceValue);

      return value ? [value] : undefined;
    }
    case "AssignedMultiChoiceAttribute": {
      const values = assigned.choiceValues
        .map(toChoiceDetails)
        .filter((value): value is AttributeValueDetailsFragment => value !== null);

      return values.length > 0 ? values : undefined;
    }
    case "AssignedSwatchAttribute": {
      const value = toChoiceDetails(assigned.swatchValue);

      return value ? [value] : undefined;
    }
    default:
      return undefined;
  }
};

const mergeChoicesBySlug = (
  choices: AttributeValueDetailsFragment[],
  extra: AttributeValueDetailsFragment[] | undefined,
): AttributeValueDetailsFragment[] => {
  if (!extra?.length) {
    return choices;
  }

  const bySlug = new Map(choices.map(choice => [choice.slug, choice]));

  extra.forEach(choice => {
    if (choice.slug && !bySlug.has(choice.slug)) {
      bySlug.set(choice.slug, choice);
    }
  });

  return Array.from(bySlug.values());
};

export const getAttributeInputFromCustomerType = ({
  assignedAttributes = [],
  customerType,
  previousAttributes = [],
}: {
  assignedAttributes?: CustomerAssignedAttributeFragment[];
  customerType: CustomerTypeOnCustomerFragment | null | undefined;
  previousAttributes?: AttributeInput[];
}): AttributeInput[] => {
  const assignedById = new Map(
    assignedAttributes.map(assigned => [assigned.attribute.id, assigned]),
  );
  const previousById = new Map(previousAttributes.map(attribute => [attribute.id, attribute]));

  return (customerType?.attributes ?? []).map(attribute => {
    const previous = previousById.get(attribute.id);
    const assigned = assignedById.get(attribute.id);
    const mapped = assigned ? mapAssignedAttribute(assigned) : undefined;
    // Empty arrays are truthy, so `previous?.value ?? mapped` would hide
    // stored assignments when switching types (or reverting) with a blank field.
    const usePreviousValue = hasFilledAttributeValue(previous?.value);
    const selectedValues = usePreviousValue
      ? previous?.data.selectedValues
      : getAssignedSelectedValues(assigned);
    const typeChoices = mapEdgesToItems(attribute.choices) || [];

    return {
      additionalData: usePreviousValue ? previous?.additionalData : mapped?.additionalData,
      data: {
        entityType: attribute.entityType ?? undefined,
        inputType: attribute.inputType ?? AttributeInputTypeEnum.DROPDOWN,
        isRequired: attribute.valueRequired,
        selectedValues,
        unit: attribute.unit,
        values: mergeChoicesBySlug(typeChoices, selectedValues),
      },
      id: attribute.id,
      label: attribute.name,
      value: usePreviousValue && previous ? previous.value : (mapped?.value ?? []),
    };
  });
};

export const getAttributeInputFromCustomer = (
  customer:
    | {
        assignedAttributes?: CustomerAssignedAttributeFragment[] | null;
        customerType?: CustomerTypeOnCustomerFragment | null;
      }
    | null
    | undefined,
): AttributeInput[] =>
  getAttributeInputFromCustomerType({
    assignedAttributes: customer?.assignedAttributes ?? [],
    customerType: customer?.customerType,
  });

const hasSelectableValue = (
  value?: { id?: string | null; value?: string | null } | null,
): boolean => Boolean(value?.id || value?.value);

/**
 * Saleor keeps assignments that aren't in the payload. Empty values in the
 * payload are treated as "clear this attribute" and delete the assignment.
 * On type change we must not send empties: hidden values from the previous
 * type would be wiped if the merchant later switched back.
 */
export const customerAttributeInputHasValue = (input: AttributeValueInput): boolean => {
  if (input.boolean === true || input.boolean === false) {
    return true;
  }

  if (hasSelectableValue(input.dropdown) || hasSelectableValue(input.swatch)) {
    return true;
  }

  if (input.multiselect?.some(hasSelectableValue)) {
    return true;
  }

  if (input.plainText || input.richText || input.file) {
    return true;
  }

  if (input.date || input.dateTime || input.reference || input.numeric) {
    return true;
  }

  if (input.references && input.references.length > 0) {
    return true;
  }

  return Boolean(input.values?.some(Boolean));
};

export const getCustomerUpdateAttributesInput = ({
  attributes,
  prevAttributes,
  typeChanged,
  updatedFileAttributes,
}: {
  attributes: AttributeInput[];
  prevAttributes: AttributeInput[] | null;
  typeChanged: boolean;
  updatedFileAttributes: AttributeValueInput[];
}): AttributeValueInput[] | undefined => {
  const prepared = prepareAttributesInput({
    attributes,
    prevAttributes: typeChanged ? null : prevAttributes,
    updatedFileAttributes,
  });

  if (!typeChanged) {
    return prepared;
  }

  const withValues = prepared.filter(customerAttributeInputHasValue);

  return withValues.length > 0 ? withValues : undefined;
};
