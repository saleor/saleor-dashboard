import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React from "react";

export enum OrderRefundType {
  MISCELLANEOUS = "miscellaneous",
  PRODUCTS = "products"
}
export enum OrderRefundAmountCalculationMode {
  AUTOMATIC = "automatic",
  MANUAL = "manual"
}

export interface OrderRefundData {
  amount: number | string;
  type: OrderRefundType;
  refundShipmentCosts: boolean;
  amountCalculationMode: OrderRefundAmountCalculationMode;
}

export interface OrderRefundHandlers {
  changeRefundedProductQuantity: FormsetChange<string>;
  setMaximalRefundedProductQuantities: () => void;
  changeRefundedFulfilledProductQuantity: FormsetChange<string>;
  setMaximalRefundedFulfilledProductQuantities: (fulfillmentId: string) => void;
}

export interface OrderRefundFormData extends OrderRefundData {
  refundedProductQuantities: FormsetData<null, string>;
  refundedFulfilledProductQuantities: FormsetData<null, string>;
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
    amountCalculationMode: OrderRefundAmountCalculationMode.AUTOMATIC,
    refundShipmentCosts: false,
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
    order?.lines
      .filter(line => line.quantityFulfilled !== line.quantity)
      .map(line => ({
        data: null,
        id: line.id,
        label: null,
        value: "0"
      }))
  );
  const refundedFulfilledProductQuantities = useFormset<null, string>(
    order?.fulfillments
      .filter(fulfillment => fulfillment.status === FulfillmentStatus.FULFILLED)
      .reduce(
        (linesQty, fulfillemnt) =>
          linesQty.concat(
            fulfillemnt.lines.map(fulfillmentLine => ({
              data: null,
              id: fulfillmentLine.id,
              label: null,
              value: "0"
            }))
          ),
        []
      )
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
  const handleRefundedFulFilledProductQuantityChange = (
    id: string,
    value: string
  ) => {
    triggerChange();
    refundedFulfilledProductQuantities.change(id, value);
  };
  const handleMaximalRefundedProductQuantitiesSet = () => {
    const newQuantities: FormsetData<
      null,
      string
    > = refundedProductQuantities.data.map(selectedLine => {
      const line = order.lines.find(line => line.id === selectedLine.id);

      return {
        data: null,
        id: line.id,
        label: null,
        value: (line.quantity - line.quantityFulfilled).toString()
      };
    });
    refundedProductQuantities.set(newQuantities);
    triggerChange();
  };
  const handleMaximalRefundedFulfilledProductQuantitiesSet = (
    fulfillmentId: string
  ) => {
    const fulfillment = order.fulfillments.find(
      fulfillment => fulfillment.id === fulfillmentId
    );
    const newQuantities: FormsetData<
      null,
      string
    > = refundedFulfilledProductQuantities.data.map(selectedLine => {
      const line = fulfillment.lines.find(line => line.id === selectedLine.id);

      if (line) {
        return {
          data: null,
          id: line.id,
          label: null,
          value: line.quantity.toString()
        };
      }
      return selectedLine;
    });
    refundedFulfilledProductQuantities.set(newQuantities);
    triggerChange();
  };

  const data: OrderRefundFormData = {
    ...form.data,
    refundedFulfilledProductQuantities: refundedFulfilledProductQuantities.data,
    refundedProductQuantities: refundedProductQuantities.data
  };

  const submit = () => handleFormSubmit(data, onSubmit, setChanged);

  const disabled = !order;

  return {
    change: handleChange,
    data,
    disabled,
    handlers: {
      changeRefundedFulfilledProductQuantity: handleRefundedFulFilledProductQuantityChange,
      changeRefundedProductQuantity: handleRefundedProductQuantityChange,
      setMaximalRefundedFulfilledProductQuantities: handleMaximalRefundedFulfilledProductQuantitiesSet,
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
