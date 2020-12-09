import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React, { useState } from "react";

import {
  getById,
  getFulfilledFulfillemnts,
  getParsedFulfiledLines
} from "./utils";

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
  order: OrderDetails_order;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

function getOrderRefundPageFormData(): OrderReturnData {
  return {
    amount: undefined,
    refundShipmentCosts: false
  };
}

function useOrderReturnForm(
  order: OrderDetails_order,
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
    getFulfilledFulfillemnts(order).reduce(
      (result, { lines }) => [
        ...result,
        ...getParsedFulfiledLines(lines).map(getParsedLineData(0))
      ],
      []
    )
  );

  const getItemsToBeReplaced = () => {
    if (!order) {
      return [];
    }

    const orderLinesItems = order.lines.map(getParsedLineData(true));

    const fulfilmentsItems = getFulfilledFulfillemnts(order).reduce(
      (result, { lines }) => [
        ...result,
        ...getParsedFulfiledLines(lines).map(getParsedLineData(true))
      ],
      []
    );

    return [...orderLinesItems, ...fulfilmentsItems];
  };

  const itemsToBeReplaced = useFormset<null, boolean>(getItemsToBeReplaced());

  const handleSetMaximalUnfulfiledItemsQuantities = () => {
    const newQuantities: FormsetData<
      null,
      number
    > = unfulfiledItemsQuantites.data.map(({ id }) => {
      const line = order.lines.find(getById(id));
      const value = line.quantity - line.quantityFulfilled;

      return getLineItem(line, value);
    });

    triggerChange();
    unfulfiledItemsQuantites.set(newQuantities);
  };

  const handleSetMaximalFulfiledItemsQuantities = (
    fulfillmentId: string
  ) => () => {
    const { lines } = order.fulfillments.find(getById(fulfillmentId));

    const newQuantities: FormsetData<
      null,
      number
    > = fulfiledItemsQuatities.data.map(item => {
      const line = lines.find(getById(item.id));

      if (!line) {
        return item;
      }

      return getLineItem(line, line.quantity);
    });

    triggerChange();
    fulfiledItemsQuatities.set(newQuantities);
  };

  const data: OrderReturnFormData = {
    fulfiledItemsQuantities: fulfiledItemsQuatities.data,
    itemsToBeReplaced: itemsToBeReplaced.data,
    unfulfiledItemsQuantities: unfulfiledItemsQuantites.data,
    ...form.data
  };

  const submit = () => handleFormSubmit(data, onSubmit, setHasChanged);

  const triggerChange = () => setHasChanged(true);

  function handleHandlerChange<T>(callback: (id: string, value: T) => void) {
    return (id: string, value: T) => {
      triggerChange();
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
      handleSetMaximalFulfiledItemsQuantities,
      handleSetMaximalUnfulfiledItemsQuantities
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
