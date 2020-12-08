import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React, { useState } from "react";

import { getById } from "./utils";

export interface OrderReturnData {
  amount: number | string;
  refundShipmentCosts: boolean;
}

export interface OrderReturnHandlers {
  changeFulfiledItemsQuantity: FormsetChange<number>;
  changeUnfulfiledItemsQuantity: FormsetChange<number>;
  changeItemsToBeReplaced: FormsetChange<boolean>;
  handleSetMaximalFulfiledItemsQuantities;
  handleSetMaximalUnfulfiledItemsQuantities;
}

export interface OrderReturnFormData extends OrderReturnData {
  itemsToBeReplaced: FormsetData<null, boolean>;
  fulfiledItemsQuantities: FormsetData<null, number>;
  unfulfiledItemsQuantities: FormsetData<null, number>;
}

export type OrderRefundSubmitData = OrderReturnFormData;

export interface UseOrderRefundFormResult {
  change: FormChange;
  hasChanged: boolean;
  data: OrderReturnFormData;
  handlers: OrderReturnHandlers;
  submit: () => Promise<boolean>;
}

interface OrderReturnProps {
  children: (props: UseOrderRefundFormResult) => React.ReactNode;
  order: OrderRefundData_order;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

function getOrderRefundPageFormData(): OrderReturnData {
  return {
    amount: undefined,
    refundShipmentCosts: false
  };
}

function useOrderReturnForm(
  order: OrderRefundData_order,
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise
): UseOrderRefundFormResult {
  const form = useForm(getOrderRefundPageFormData());
  const [hasChanged, setHasChanged] = useState(false);

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
  };

  function getLineItem<T>({ id }: { id: string }, value: T) {
    return {
      data: null,
      id,
      label: null,
      value
    };
  }

  function getParsedLineData<T>(initialValue: T) {
    return (item: { id: string }) => getLineItem(item, initialValue);
  }

  const unfulfiledItemsQuantites = useFormset<null, number>(
    order?.lines
      .filter(line => line.quantityFulfilled !== line.quantity)
      .map(getParsedLineData(0))
  );

  const fulfiledItemsQuatities = useFormset<null, number>(
    order?.fulfillments
      .filter(fulfillment => fulfillment.status === FulfillmentStatus.FULFILLED)
      .reduce(
        (linesQty, fulfillemnt) =>
          linesQty.concat(fulfillemnt.lines.map(getParsedLineData(0))),
        []
      )
  );

  const itemsToBeReplaced = useFormset<null, boolean>(
    order?.lines.map(getParsedLineData(true))
  );

  const handleSetMaximalUnfulfiledItemsQuantities = () => {
    const newQuantities: FormsetData<
      null,
      number
    > = unfulfiledItemsQuantites.data.map(({ id }) => {
      const line = order.lines.find(getById(id));
      const value = line.quantity - line.quantityFulfilled;

      return getLineItem(line, value);
    });

    unfulfiledItemsQuantites.set(newQuantities);
  };

  const handleSetMaximalFulfiledItemsQuantities = (fulfillmentId: string) => {
    const fulfillment = order.fulfillments.find(getById(fulfillmentId));

    const newQuantities: FormsetData<
      null,
      number
    > = fulfiledItemsQuatities.data.map(({ id }) => {
      const line = fulfillment.lines.find(getById(id));

      return getLineItem(line, line.quantity);
    });

    fulfiledItemsQuatities.set(newQuantities);
  };

  const data: OrderReturnFormData = {
    fulfiledItemsQuantities: fulfiledItemsQuatities.data,
    itemsToBeReplaced: itemsToBeReplaced.data,
    unfulfiledItemsQuantities: unfulfiledItemsQuantites.data,
    ...form.data
  };

  const submit = () => handleFormSubmit(data, onSubmit, setHasChanged);

  function handleHandlerChange<T>(callback: (id: string, value: T) => void) {
    return (id: string, value: T) => {
      setHasChanged(true);
      callback(id, value);
    };
  }

  return {
    change: handleChange,
    data,
    handlers: {
      changeFulfiledItemsQuantity: handleHandlerChange(
        fulfiledItemsQuatities.change
      ),
      changeItemsToBeReplaced: handleHandlerChange(itemsToBeReplaced.change),
      changeUnfulfiledItemsQuantity: handleHandlerChange(
        unfulfiledItemsQuantites.change
      ),
      handleSetMaximalFulfiledItemsQuantities: handleHandlerChange(
        handleSetMaximalFulfiledItemsQuantities
      ),
      handleSetMaximalUnfulfiledItemsQuantities: handleHandlerChange(
        handleSetMaximalUnfulfiledItemsQuantities
      )
    },
    hasChanged,
    submit
  };
}

const OrderReturnForm: React.FC<OrderReturnProps> = ({
  children,
  order,
  onSubmit
}) => {
  const props = useOrderReturnForm(order, onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderReturnForm.displayName = "OrderReturnForm";
export default OrderReturnForm;
