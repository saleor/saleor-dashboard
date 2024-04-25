import { createContext, useContext } from "react";

import { ManualRefundData } from "./hooks";
import { OrderManualTransactionFormProps } from "./OrderManualTransactionForm";

export const ManualTransactionContext = createContext<
  (ManualRefundData & OrderManualTransactionFormProps) | null
>(null);

export const useManualTransactionContext = () => useContext(ManualTransactionContext);
