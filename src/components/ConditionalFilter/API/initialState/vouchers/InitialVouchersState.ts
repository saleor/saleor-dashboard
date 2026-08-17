import { type ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { type UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialVouchersState {
  channels: ItemOption[];
  discountType: ItemOption[];
  voucherStatus: ItemOption[];
}

const isDateField = (name: string) => ["started"].includes(name);
const isNumericField = (name: string) => ["timesUsed"].includes(name);

export class InitialVouchersStateResponse implements InitialVouchersState {
  constructor(
    public channels: ItemOption[] = [],
    public discountType: ItemOption[] = [],
    public voucherStatus: ItemOption[] = [],
  ) {}

  public static empty() {
    return new InitialVouchersStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    if (isDateField(token.name) || isNumericField(token.name)) {
      return token.value;
    }

    const entry = this.getEntryByName(token.name);

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return (entry as ItemOption[]).filter(({ slug }) => {
      if (!slug) {
        return false;
      }

      if (Array.isArray(token.value)) {
        return token.value.includes(slug);
      }

      return slug === token.value;
    });
  }

  private getEntryByName(name: string): ItemOption[] {
    switch (name) {
      case "channel":
        return this.channels;
      case "discountType":
        return this.discountType;
      case "voucherStatus":
        return this.voucherStatus;
      default:
        return [];
    }
  }
}
