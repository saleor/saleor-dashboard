import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { createBooleanOption } from "../constants";
import { AttributeInputType } from "../FilterElement/ConditionOptions";
import { ItemOption } from "../FilterElement/ConditionValue";
import { UrlToken } from "../ValueProvider/UrlToken";

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
}

export interface InitialState {
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

export class InitialStateResponse implements InitialState {
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
    return new InitialStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    if (token.isAttribute() && token.hasDynamicValues()) {
      return this.attribute[token.name].choices.filter(({ value }) => token.value.includes(value));
    }

    if (token.isAttribute()) {
      const attr = this.attribute[token.name];

      return attr.inputType === "BOOLEAN"
        ? createBooleanOption(token.value === "true", AttributeInputTypeEnum.BOOLEAN)
        : token.value;
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
