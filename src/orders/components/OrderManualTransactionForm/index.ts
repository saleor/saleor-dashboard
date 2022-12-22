import { ReactElement } from "react";

import {
  DescriptionField,
  ErrorText,
  Form,
  PriceInputField,
  SubmitButton,
} from "./components";
import {
  OrderManualTransactionForm as MainComponent,
  OrderManualTransactionFormProps as MainComponentProps,
} from "./OrderManualTransactionForm";

interface OrderManualTransactionCombinedComponent {
  (props: OrderManualTransactionFormProps): ReactElement | null;
  DescriptionField: typeof DescriptionField;
  ErrorText: typeof ErrorText;
  Form: typeof Form;
  PriceInputField: typeof PriceInputField;
  SubmitButton: typeof SubmitButton;
}

export const OrderManualTransactionForm = MainComponent as OrderManualTransactionCombinedComponent;
OrderManualTransactionForm.DescriptionField = DescriptionField;
OrderManualTransactionForm.ErrorText = ErrorText;
OrderManualTransactionForm.Form = Form;
OrderManualTransactionForm.PriceInputField = PriceInputField;
OrderManualTransactionForm.SubmitButton = SubmitButton;

export type OrderManualTransactionFormProps = MainComponentProps;
