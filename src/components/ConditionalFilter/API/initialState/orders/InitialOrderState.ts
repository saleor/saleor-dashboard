import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialOrderState {
  paymentStatus: ItemOption[];
  status: ItemOption[];
  authorizeStatus: ItemOption[];
  chargeStatus: ItemOption[];
  channels: ItemOption[];
  isClickAndCollect: ItemOption[];
  isPreorder: ItemOption[];
  giftCardBought: ItemOption[];
  giftCardUsed: ItemOption[];
  customer: ItemOption[];
  created: string | string[];
  updatedAt: string | string[];
  ids: ItemOption[];
}

const isTextInput = (name: string) => ["customer"].includes(name);
const isDateField = (name: string) => ["created", "updatedAt"].includes(name);

export class InitialOrderStateResponse implements InitialOrderState {
  constructor(
    public paymentStatus: ItemOption[] = [],
    public status: ItemOption[] = [],
    public authorizeStatus: ItemOption[] = [],
    public chargeStatus: ItemOption[] = [],
    public channels: ItemOption[] = [],
    public isClickAndCollect: ItemOption[] = [],
    public isPreorder: ItemOption[] = [],
    public giftCardBought: ItemOption[] = [],
    public giftCardUsed: ItemOption[] = [],
    public customer: ItemOption[] = [],
    public created: string | string[] = [],
    public updatedAt: string | string[] = [],
    public ids: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialOrderStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    if (isDateField(token.name)) {
      return token.value;
    }

    const entry = this.getEntryByName(token.name);

    if (isTextInput(token.name)) {
      return entry;
    }

    return (entry as ItemOption[]).filter(({ slug }) => slug && token.value.includes(slug));
  }

  private getEntryByName(name: string): ItemOption[] | string | string[] {
    switch (name) {
      case "paymentStatus":
        return this.paymentStatus;
      case "status":
        return this.status;
      case "authorizeStatus":
        return this.authorizeStatus;
      case "chargeStatus":
        return this.chargeStatus;
      case "channels":
        return this.channels;
      case "isClickAndCollect":
        return this.isClickAndCollect;
      case "isPreorder":
        return this.isPreorder;
      case "giftCardBought":
        return this.giftCardBought;
      case "giftCardUsed":
        return this.giftCardUsed;
      case "customer":
        return this.customer;
      case "ids":
        return this.ids;
      default:
        return [];
    }
  }
}
