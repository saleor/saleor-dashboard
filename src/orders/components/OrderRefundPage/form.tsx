import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React from "react";

// TODO: This type probably need to be replaced with generated GraphQL type!
export enum OrderRefundType {
  MISCELLANEOUS = "miscellaneous",
  PRODUCTS = "products"
}

export interface OrderRefundData {
  amount: number | string;
  type: OrderRefundType;
}

export interface OrderRefundHandlers {
  changeRefundedProductQuantity: FormsetChange<string>;
  setMaximalRefundedProductQuantities: () => void;
}

export interface OrderRefundFormData extends OrderRefundData {
  refundedProductQuantities: FormsetData<null, string>;
}

export type OrderRefundSubmitData = OrderRefundFormData;

export interface UseOrderRefundFormResult {
  change: FormChange;
  data: OrderRefundFormData;
  disabled: boolean;
  handlers: OrderRefundHandlers;
  hasChanged: boolean;
  submit: () => Promise<boolean>;
}

interface OrderRefundFormProps {
  children: (props: UseOrderRefundFormResult) => React.ReactNode;
  order: OrderRefundData_order;
  defaultType: OrderRefundType;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

function getOrderRefundPageFormData(
  defaultType: OrderRefundType
): OrderRefundData {
  return {
    amount: undefined,
    type: defaultType
  };
}

function useOrderRefundForm(
  order: OrderRefundData_order,
  defaultType: OrderRefundType,
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise
): UseOrderRefundFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm(getOrderRefundPageFormData(defaultType));
  const refundedProductQuantities = useFormset<null, string>(
    order?.lines.map(line => ({
      data: null,
      id: line.id,
      label: null,
      value: "0"
    }))
  );

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };
  const handleRefundedProductQuantityChange: FormsetChange<string> = (
    id,
    value
  ) => {
    triggerChange();
    refundedProductQuantities.change(id, value);
  };
  const handleMaximalRefundedProductQuantitiesSet = () => undefined;

  const data: OrderRefundFormData = {
    ...form.data,
    refundedProductQuantities: refundedProductQuantities.data
  };

  const submit = () => handleFormSubmit(data, onSubmit, setChanged);

  const disabled = !order;

  return {
    change: handleChange,
    data,
    disabled,
    handlers: {
      changeRefundedProductQuantity: handleRefundedProductQuantityChange,
      setMaximalRefundedProductQuantities: handleMaximalRefundedProductQuantitiesSet
    },
    hasChanged: changed,
    submit
  };
}

const OrderRefundForm: React.FC<OrderRefundFormProps> = ({
  children,
  order,
  defaultType,
  onSubmit
}) => {
  const props = useOrderRefundForm(order, defaultType, onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderRefundForm.displayName = "OrderRefundForm";
export default OrderRefundForm;
