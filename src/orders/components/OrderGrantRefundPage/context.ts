import { UseFormResult } from "@dashboard/hooks/useForm";
import { createContext, useContext } from "react";

import { OrderGrantRefundFormData } from "./form";
import { GrantRefundAction, GrantRefundState } from "./reducer";

interface GrantRefundContext {
  state: GrantRefundState;
  dispatch: React.Dispatch<GrantRefundAction>;
  form: Pick<UseFormResult<OrderGrantRefundFormData>, "set" | "data" | "change">;
  totalSelectedPrice: number;
}

export const GrantRefundContext = createContext<GrantRefundContext | null>(null);

export const useGrantRefundContext = () => {
  const context = useContext(GrantRefundContext);

  if (context === null) {
    throw new Error("useGrantRefundContext used outside of context provider");
  }

  return context;
};
