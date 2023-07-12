// @ts-strict-ignore
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { exhaustiveCheck } from "@dashboard/utils/ts";

export interface ReducerOrderLine {
  selectedQuantity: number;
  availableQuantity: number;
  unitPrice: number;
}

export interface GrantRefundState {
  lines: Map<string, ReducerOrderLine>;
  refundShipping: boolean;
}

export type GrantRefundLineKeyValue = [string, ReducerOrderLine];

export type GrantRefundAction =
  | {
      type: "setQuantity";
      lineId: string;
      amount: number;
    }
  | {
      type: "setMaxQuantity";
      lineIds: string[];
    }
  | {
      type: "initState";
      state: GrantRefundState;
    }
  | {
      type: "toggleRefundShipping";
    };

export const getGrantRefundReducerInitialState = (
  order: OrderDetailsGrantRefundFragment,
): GrantRefundState => {
  const unfulfilledLines = order?.lines
    .filter(line => line.quantityToFulfill > 0)
    .map<GrantRefundLineKeyValue>(line => [
      line.id,
      {
        availableQuantity: line.quantity,
        unitPrice: line.unitPrice.gross.amount,
        selectedQuantity: 0,
      },
    ]);

  const fulfilmentLines = order.fulfillments
    .flatMap(fulfilment => fulfilment.lines)
    .map<GrantRefundLineKeyValue>(line => [
      line.id,
      {
        availableQuantity: line.quantity,
        unitPrice: line.orderLine.unitPrice.gross.amount,
        selectedQuantity: 0,
      },
    ]);

  return {
    lines: new Map([...unfulfilledLines, ...fulfilmentLines]),
    refundShipping: false,
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
      if (!state.lines.has(action.lineId)) {
        return state;
      }

      const line = state.lines.get(action.lineId);
      const newLines = new Map(state.lines);

      newLines.set(action.lineId, {
        ...line,
        selectedQuantity: action.amount,
      });

      return {
        ...state,
        lines: newLines,
      };
    }

    case "setMaxQuantity": {
      const newLines = new Map(state.lines);

      action.lineIds.forEach(lineId => {
        const line = state.lines.get(lineId);

        newLines.set(lineId, {
          ...line,
          selectedQuantity: line.availableQuantity,
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

    default:
      exhaustiveCheck(action);
  }
}
