import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React from "react";

// TODO: This type probably need to be replaced with generated GraphQL type!
export enum OrderRefundType {
  MISCELLANEOUS
}

export interface OrderRefundData {
  amount: number | string;
  type: OrderRefundType;
}

export interface OrderRefundHandlers {
  changeOrderRefundType: FormChange;
}

export type OrderRefundSubmitData = OrderRefundData;

export interface UseOrderRefundFormResult {
  change: FormChange;
  data: OrderRefundData;
  disabled: boolean;
  handlers: OrderRefundHandlers;
  hasChanged: boolean;
  submit: () => Promise<boolean>;
}

interface OrderRefundFormProps {
  children: (props: UseOrderRefundFormResult) => React.ReactNode;
  order: OrderRefundData_order;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

function getOrderRefundPageFormData() {
  return {
    amount: undefined,
    type: OrderRefundType.MISCELLANEOUS
  };
}

function useOrderRefundForm(
  order: OrderRefundData_order,
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise
): UseOrderRefundFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm(getOrderRefundPageFormData());

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };

  const handleOrderRefundTypeChange: FormChange = () => undefined; // TODO: handle change!!!

  const data: OrderRefundData = {
    ...form.data
  };

  const submit = () => handleFormSubmit(data, onSubmit, setChanged);

  const disabled = !order;

  return {
    change: handleChange,
    data,
    disabled,
    handlers: { changeOrderRefundType: handleOrderRefundTypeChange },
    hasChanged: changed,
    submit
  };
}

const OrderRefundForm: React.FC<OrderRefundFormProps> = ({
  children,
  order,
  onSubmit
}) => {
  const props = useOrderRefundForm(order, onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderRefundForm.displayName = "OrderRefundForm";
export default OrderRefundForm;
