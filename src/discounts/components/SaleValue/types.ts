import { SaleType } from "@saleor/types/globalTypes";

export type SaleValueInputChangeType = (
  channelId: string,
  discountValue: string,
  percentageValue: string,
  fixedValue: string,
  saleType: SaleType
) => void;
