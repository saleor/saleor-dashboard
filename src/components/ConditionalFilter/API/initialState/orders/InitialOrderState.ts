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
  giftCardUsage: ItemOption[];
}

export class InitialOrderStateResponse implements InitialOrderState {
  constructor(
    public paymentStatus: ItemOption[] = [],
    public status: ItemOption[] = [],
    public authorizeStatus: ItemOption[] = [],
    public chargeStatus: ItemOption[] = [],
    public channels: ItemOption[] = [],
    public isClickAndCollect: ItemOption[] = [],
    public isPreorder: ItemOption[] = [],
    public giftCardUsage: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialOrderStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    return this.getEntryByName(token.name).filter(({ slug }) => slug && token.value.includes(slug));
  }

  private getEntryByName(name: string): ItemOption[] {
    return this[name] ?? [];
  }
}
