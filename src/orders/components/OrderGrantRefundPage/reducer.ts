// @ts-strict-ignore
import {
  OrderDetailsGrantedRefundFragment,
  OrderDetailsGrantRefundFragment,
} from "@dashboard/graphql";
import { exhaustiveCheck } from "@dashboard/utils/ts";

import { getLineAvailableQuantity } from "./utils";

export interface ReducerOrderLine {
  orderLineId: string;
  selectedQuantity: number;
  availableQuantity: number;
  initialQuantity?: number;
  unitPrice: number;
  isDirty: boolean;
}

export interface GrantRefundState {
  lines: Map<string, ReducerOrderLine>;
  refundShipping: boolean;
}

type GrantRefundLineKeyValue = [string, ReducerOrderLine];

export type GrantRefundAction =
  | {
      type: "setQuantity";
      lineId: string;
      amount: number;
      unitPrice: number;
    }
  | {
      type: "setMaxQuantity";
      lines: Array<{
        id: string;
        quantity: number;
        unitPrice: number;
      }>;
    }
  | {
      type: "initState";
      state: GrantRefundState;
    }
  | {
      type: "toggleRefundShipping";
    }
  | {
      type: "setRefundShipping";
      refundShipping: boolean;
    };

export const getGrantRefundReducerInitialState = (
  order: OrderDetailsGrantRefundFragment,
  grantedRefund?: OrderDetailsGrantedRefundFragment,
): GrantRefundState => {
  const toGrantRefundLine = createToGrantRefundLineMap(order, grantedRefund);
  const unfulfilledLines = order?.lines
    .filter(line => line.quantityToFulfill > 0)
    .map(toGrantRefundLine);
  const fulfilmentLines = order.fulfillments
    .flatMap(fulfilment => fulfilment.lines)
    .map(toGrantRefundLine);

  return {
    lines: new Map([...unfulfilledLines, ...fulfilmentLines]),
    refundShipping: grantedRefund?.shippingCostsIncluded ?? false,
  };
};

export const grantRefundDefaultState: GrantRefundState = {
  lines: new Map(),
  refundShipping: false,
};

export function grantRefundReducer(
  state: GrantRefundState,
  action: GrantRefundAction,
): GrantRefundState {
  switch (action.type) {
    case "setQuantity": {
      const line = state.lines.get(action.lineId);
      const newLines = new Map(state.lines);

      newLines.set(action.lineId, {
        ...line,
        isDirty: action.amount !== line.initialQuantity,
        unitPrice: action.unitPrice,
        selectedQuantity: action.amount,
      });

      return {
        ...state,
        lines: newLines,
      };
    }
    case "setMaxQuantity": {
      const newLines = new Map(state.lines);

      action.lines.forEach(line => {
        const currentLine = state.lines.get(line.id);

        newLines.set(line.id, {
          ...currentLine,
          isDirty: line.quantity !== currentLine.initialQuantity,
          unitPrice: line.unitPrice,
          selectedQuantity: line.quantity,
        });
      });

      return {
        ...state,
        lines: newLines,
      };
    }
    case "initState": {
      return action.state;
    }
    case "toggleRefundShipping": {
      return {
        ...state,
        refundShipping: !state.refundShipping,
      };
    }
    case "setRefundShipping": {
      return {
        ...state,
        refundShipping: action.refundShipping,
      };
    }

    default:
      exhaustiveCheck(action);
  }
}

function createToGrantRefundLineMap(
  order: OrderDetailsGrantRefundFragment,
  grantedRefund?: OrderDetailsGrantedRefundFragment,
) {
  return (
    line:
      | OrderDetailsGrantRefundFragment["lines"][0]
      | OrderDetailsGrantRefundFragment["fulfillments"][0]["lines"][0],
  ): GrantRefundLineKeyValue => {
    const initialQuantity =
      grantedRefund?.lines?.find(initLine => initLine.orderLine.id === line.id)?.quantity ?? 0;

    return [
      line.id,
      {
        orderLineId: "orderLine" in line ? line.orderLine.id : line.id,
        isDirty: false,
        availableQuantity: getLineAvailableQuantity({
          lineId: line.id,
          lineQuntity: line.quantity,
          grantRefunds: order?.grantedRefunds,
          grantRefundId: grantedRefund?.id,
        }),
        unitPrice:
          "orderLine" in line ? line.orderLine.unitPrice.gross.amount : line.unitPrice.gross.amount,
        selectedQuantity: initialQuantity,
        initialQuantity,
      },
    ];
  };
}
