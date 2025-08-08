import { ApolloClient } from "@apollo/client";
import { 
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatus
} from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { EnumValuesHandler, Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

const SUPPORTED_ORDER_STATUS_FILTERS = new Set([
  "status",
  "authorizeStatus", 
  "chargeStatus",
] as const);

type SupportedOrderStatusKeys =
  typeof SUPPORTED_ORDER_STATUS_FILTERS extends Set<infer T> ? T : never;

export type OrderStatusEnumFilterQueryPart = {
  status?: { oneOf?: OrderStatus[] };
  authorizeStatus?: { oneOf?: OrderAuthorizeStatusEnum[] };
  chargeStatus?: { oneOf?: OrderChargeStatusEnum[] };
};

export class OrderStatusEnumQueryVarsBuilder
  extends BaseMappableQueryVarsBuilder<OrderStatusEnumFilterQueryPart>
{
  constructor(private intl: IntlShape) {
    super();
  }

  canHandle(element: FilterElement): boolean {
    return SUPPORTED_ORDER_STATUS_FILTERS.has(element.value.value as SupportedOrderStatusKeys);
  }

  createOptionFetcher(
    _client: ApolloClient<unknown>,
    _inputValue: string,
    element: FilterElement,
  ): Handler {
    const fieldName = element.value.value as SupportedOrderStatusKeys;
    
    switch (fieldName) {
      case "status":
        return new EnumValuesHandler(
          OrderStatus,
          "status",
          this.intl,
        );
      case "authorizeStatus":
        return new EnumValuesHandler(
          OrderAuthorizeStatusEnum,
          "authorizeStatus", 
          this.intl,
        );
      case "chargeStatus":
        return new EnumValuesHandler(
          OrderChargeStatusEnum,
          "chargeStatus",
          this.intl,
        );
      default:
        throw new Error(`Unsupported order status field: ${fieldName}`);
    }
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value;
  }
}