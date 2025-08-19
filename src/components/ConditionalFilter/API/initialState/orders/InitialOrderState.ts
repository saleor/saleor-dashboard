import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialOrderState {
  status: ItemOption[];
  authorizeStatus: ItemOption[];
  chargeStatus: ItemOption[];
  isClickAndCollect: ItemOption[];
  isGiftCardBought: ItemOption[];
  isGiftCardUsed: ItemOption[];
  hasInvoices: ItemOption[];
  hasFulfillments: ItemOption[];
  createdAt: string | string[];
  updatedAt: string | string[];
  invoicesCreatedAt: string | string[];
  totalGross: string | string[];
  totalNet: string | string[];
  user: ItemOption[];
  channelId: ItemOption[];
  ids: ItemOption[];
  number: ItemOption[];
  userEmail: ItemOption[];
  voucherCode: ItemOption[];
  linesCount: ItemOption[];
}

const isDateField = (name: string) => ["createdAt", "updatedAt", "invoicesCreatedAt"].includes(name);
const isPriceField = (name: string) => ["totalGross", "totalNet"].includes(name);
const isNumericField = (name: string) => ["number", "linesCount"].includes(name);

export class InitialOrderStateResponse implements InitialOrderState {
  constructor(
    public status: ItemOption[] = [],
    public authorizeStatus: ItemOption[] = [],
    public chargeStatus: ItemOption[] = [],
    public isClickAndCollect: ItemOption[] = [],
    public isGiftCardBought: ItemOption[] = [],
    public isGiftCardUsed: ItemOption[] = [],
    public hasInvoices: ItemOption[] = [],
    public hasFulfillments: ItemOption[] = [],
    public createdAt: string | string[] = [],
    public updatedAt: string | string[] = [],
    public invoicesCreatedAt: string | string[] = [],
    public totalGross: string | string[] = [],
    public totalNet: string | string[] = [],
    public user: ItemOption[] = [],
    public channelId: ItemOption[] = [],
    public ids: ItemOption[] = [],
    public number: ItemOption[] = [],
    public userEmail: ItemOption[] = [],
    public voucherCode: ItemOption[] = [],
    public linesCount: ItemOption[] = [],
  ) { }

  public static empty() {
    return new InitialOrderStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    if (isDateField(token.name) || isPriceField(token.name) || isNumericField(token.name)) {
      return token.value;
    }

    const entry = this.getEntryByName(token.name);

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return (entry as ItemOption[]).filter(({ slug }) => slug && token.value.includes(slug));
  }

  private getEntryByName(name: string): ItemOption[] {
    switch (name) {
      case "status":
        return this.status;
      case "authorizeStatus":
        return this.authorizeStatus;
      case "chargeStatus":
        return this.chargeStatus;
      case "channelId":
        return this.channelId;
      case "isClickAndCollect":
        return this.isClickAndCollect;
      case "isGiftCardBought":
        return this.isGiftCardBought;
      case "isGiftCardUsed":
        return this.isGiftCardUsed;
      case "hasInvoices":
        return this.hasInvoices;
      case "hasFulfillments":
        return this.hasFulfillments;
      case "user":
        return this.user;
      case "ids":
        return this.ids;
      case "number":
        return this.number;
      case "userEmail":
        return this.userEmail;
      case "voucherCode":
        return this.voucherCode;
      case "linesCount":
        return this.linesCount;
      default:
        return [];
    }
  }
}
