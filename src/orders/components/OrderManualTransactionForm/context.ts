import { createContext, useContext } from "react";

import { type ManualRefundData } from "./hooks";
import { type OrderManualTransactionFormProps } from "./OrderManualTransactionForm";

export const ManualTransactionContext = createContext<
  (ManualRefundData & OrderManualTransactionFormProps) | null
>(null);

export const useManualTransactionContext = () => useContext(ManualTransactionContext);
