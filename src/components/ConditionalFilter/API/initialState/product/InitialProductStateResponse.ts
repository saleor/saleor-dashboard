import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@dashboard/graphql";

import { createBooleanOption } from "../../../constants";
import { AttributeInputType } from "../../../FilterElement/ConditionOptions";
import { ItemOption } from "../../../FilterElement/ConditionValue";
import { UrlToken } from "../../../ValueProvider/UrlToken";

export interface AttributeDTO {
  choices: Array<{
    label: string;
    value: string;
    slug: string;
    originalSlug?: string;
  }>;
  inputType: AttributeInputType;
  label: string;
  slug: string;
  value: string;
  entityType?: AttributeEntityTypeEnum;
}

export interface InitialProductState {
  category: ItemOption[];
  attribute: Record<string, AttributeDTO>;
  channel: ItemOption[];
  collection: ItemOption[];
  productType: ItemOption[];
  isAvailable: ItemOption[];
  isPublished: ItemOption[];
  isVisibleInListing: ItemOption[];
  hasCategory: ItemOption[];
  giftCard: ItemOption[];
}

const isDateField = (name: string) =>
  ["created", "updatedAt", "startDate", "endDate", "dateJoined", "started"].includes(name);
const isNumericField = (name: string) => ["numberOfOrders", "timesUsed"].includes(name);

export class InitialProductStateResponse implements InitialProductState {
  constructor(
    public category: ItemOption[] = [],
    public attribute: Record<string, AttributeDTO> = {},
    public channel: ItemOption[] = [],
    public collection: ItemOption[] = [],
    public productType: ItemOption[] = [],
    public isAvailable: ItemOption[] = [],
    public isPublished: ItemOption[] = [],
    public isVisibleInListing: ItemOption[] = [],
    public hasCategory: ItemOption[] = [],
    public giftCard: ItemOption[] = [],
  ) {}

  public attributeByName(name: string) {
    return this.attribute[name];
  }

  public static empty() {
    return new InitialProductStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    if (token.isAttribute() && token.hasDynamicValues()) {
      const attribute = this.attribute[token.name];
      const isReference =
        attribute?.inputType === "REFERENCE" || attribute?.inputType === "SINGLE_REFERENCE";

      if (isReference) {
        return attribute.choices.filter(({ slug }) => {
          if (!slug) return false;

          return Array.isArray(token.value) ? token.value.includes(slug) : token.value === slug;
        });
      }

      // Handle non-reference attributes - match by value
      return attribute.choices.filter(({ value }) => {
        return Array.isArray(token.value) ? token.value.includes(value) : token.value === value;
      });
    }

    if (isDateField(token.name) || isNumericField(token.name)) {
      return token.value;
    }

    if (token.isAttribute()) {
      const attr = this.attribute[token.name];

      return attr.inputType === "BOOLEAN"
        ? createBooleanOption(token.value === "true", AttributeInputTypeEnum.BOOLEAN)
        : token.value;
    }

    // Special handling for metadata fields - preserve tuple structure
    // Metadata fields use text.double and should return the raw tuple value
    const isMetadataField = [
      "metadata",
      "linesMetadata",
      "transactionsMetadata",
      "fulfillmentsMetadata",
    ].includes(token.name);

    if (isMetadataField) {
      return token.value;
    }

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return this.getEntryByName(token.name).filter(({ slug }) => slug && token.value.includes(slug));
  }

  private getEntryByName(name: string) {
    switch (name) {
      case "category":
        return this.category;
      case "collection":
        return this.collection;
      case "productType":
        return this.productType;
      case "channel":
        return this.channel;
      case "isAvailable":
        return this.isAvailable;
      case "isPublished":
        return this.isPublished;
      case "isVisibleInListing":
        return this.isVisibleInListing;
      case "hasCategory":
        return this.hasCategory;
      case "giftCard":
        return this.giftCard;
      default:
        return [];
    }
  }
}
