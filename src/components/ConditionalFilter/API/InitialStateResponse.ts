import { AttributeInputType } from "../FilterElement/ConditionOptions";
import { ItemOption } from "../FilterElement/ConditionSelected";
import { UrlToken } from "../ValueProvider/UrlToken";

interface AttributeDTO {
  choices: Array<{ label: string; value: string; slug: string }>;
  inputType: AttributeInputType;
  label: string;
  slug: string;
  value: string;
}

export class InitialStateResponse {
  constructor(
    public category: ItemOption[],
    public attribute: Record<string, AttributeDTO>,
    public channel: ItemOption[],
    public collection: ItemOption[],
    public producttype: ItemOption[],
  ) {}

  public attributeByName(name: string) {
    return this.attribute[name];
  }

  public filterByUrlToken(token: UrlToken) {
    if (token.isAttribute()) {
      return this.attribute[token.name].choices.filter(({ value }) =>
        token.value.includes(value),
      );
    }

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return this.getEntryByname(token.name).filter(
      ({ slug }) => slug && token.value.includes(slug),
    );
  }

  private getEntryByname(name: string) {
    switch (name) {
      case "category":
        return this.category;
      case "collection":
        return this.collection;
      case "producttype":
        return this.producttype;
      case "channel":
        return this.channel;
      default:
        return [];
    }
  }
}
