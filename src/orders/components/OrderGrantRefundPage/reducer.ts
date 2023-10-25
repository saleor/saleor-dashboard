// @ts-strict-ignore
import { exhaustiveCheck } from "@dashboard/utils/ts";

export interface ReducerOrderLine {
  selectedQuantity: number;
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
      type: "toggleRefundShipping";
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

      if (action.amount === 0) {
        newLines.delete(action.lineId);

        return {
          ...state,
          lines: newLines,
        };
      }

      newLines.set(action.lineId, {
        ...line,
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
          unitPrice: line.unitPrice,
          selectedQuantity: line.quantity,
        });
      });

      return {
        ...state,
        lines: newLines,
      };
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
