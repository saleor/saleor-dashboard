import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React from "react";

export interface OrderRefundData {
  amount: number | string;
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
    refundShipmentCosts: false
  };
}

function useOrderRefundForm(
  order: OrderRefundData_order,
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise
): UseOrderRefundFormResult {
  const form = useForm(getOrderRefundPageFormData());

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
  };

  const getParsedLineData = ({ id }, value = 0) => ({
    data: null,
    id,
    label: null,
    value
  });

  const unfulfiledItemsQuantites = useFormset<null, number>(
    order?.lines
      .filter(line => line.quantityFulfilled !== line.quantity)
      .map(getParsedLineData)
  );

  const fulfiledItemsQuatities = useFormset<null, number>(
    order?.fulfillments
      .filter(fulfillment => fulfillment.status === FulfillmentStatus.FULFILLED)
      .reduce(
        (linesQty, fulfillemnt) =>
          linesQty.concat(fulfillemnt.lines.map(getParsedLineData)),
        []
      )
  );

  const handleSetMaximalUnfulfiledItemsQuantities = () => {
    const newQuantities: FormsetData<
      null,
      number
    > = unfulfiledItemsQuantites.data.map(({ id }) => {
      const line = order.lines.find(line => line.id === id);
      const value = line.quantity - line.quantityFulfilled;

      return getParsedLineData(line, value);
    });

    unfulfiledItemsQuantites.set(newQuantities);
  };

  const handleSetMaximalFulfiledItemsQuantities = (fulfillmentId: string) => {
    const fulfillment = order.fulfillments.find(
      ({ id }) => id === fulfillmentId
    );

    const newQuantities: FormsetData<
      null,
      number
    > = fulfiledItemsQuatities.data.map(({ id }) => {
      const line = fulfillment.lines.find(line => line.id === id);

      return getParsedLineData(line, line.quantity);
    });

    fulfiledItemsQuatities.set(newQuantities);
  };

  const data: OrderRefundFormData = {
    fulfiledItemsQuantities: fulfiledItemsQuatities.data,
    unfulfiledItemsQuantities: unfulfiledItemsQuantites.data,
    ...form.data
  };

  const submit = () => handleFormSubmit(data, onSubmit, setChanged);

  return {
    change: handleChange,
    data,
    handlers: {
      changeFulfiledItemsQuantity: fulfiledProductsQuatities.change,
      changeUnfulfiledItemsQuantity: unfulfiledProductsQuantites.change,
      handleSetMaximalFulfiledItemsQuantities,
      handleSetMaximalUnfulfiledItemsQuantities
    },
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
