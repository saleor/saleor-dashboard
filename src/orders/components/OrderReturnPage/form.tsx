import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React, { useState } from "react";

import { OrderRefundAmountCalculationMode } from "../OrderRefundPage/form";
import {
  getById,
  getLineItem,
  getOrderUnfulfilledLines,
  getParsedLineData,
  getParsedLineDataForFulfillmentStatus
} from "./utils";

export interface LineItemOptions<T> {
  initialValue: T;
  isFulfillment?: boolean;
  isRefunded?: boolean;
}

export interface LineItemData {
  isFulfillment: boolean;
  isRefunded: boolean;
}

export type FormsetQuantityData = FormsetData<LineItemData, number>;
export type FormsetReplacementData = FormsetData<LineItemData, boolean>;

export interface OrderReturnData {
  amount: number;
  refundShipmentCosts: boolean;
  amountCalculationMode: OrderRefundAmountCalculationMode;
}

export interface OrderReturnHandlers {
  changeFulfiledItemsQuantity: FormsetChange<number>;
  changeUnfulfiledItemsQuantity: FormsetChange<number>;
  changeItemsToBeReplaced: FormsetChange<boolean>;
  handleSetMaximalFulfiledItemsQuantities;
  handleSetMaximalUnfulfiledItemsQuantities;
}

export interface OrderReturnFormData extends OrderReturnData {
  itemsToBeReplaced: FormsetReplacementData;
  fulfilledItemsQuantities: FormsetQuantityData;
  unfulfilledItemsQuantities: FormsetQuantityData;
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

const getOrderRefundPageFormData = (): OrderReturnData => ({
  amount: undefined,
  amountCalculationMode: OrderRefundAmountCalculationMode.AUTOMATIC,
  refundShipmentCosts: false
});

function useOrderReturnForm(
  order: OrderDetails_order,
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise
): UseOrderRefundFormResult {
  const form = useForm(getOrderRefundPageFormData());
  const [hasChanged, setHasChanged] = useState(false);

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
  };

  const unfulfiledItemsQuantites = useFormset<LineItemData, number>(
    getOrderUnfulfilledLines(order).map(getParsedLineData({ initialValue: 0 }))
  );

  const getItemsFulfilled = () => {
    const commonOptions = {
      initialValue: 0,
      isFulfillment: true
    };

    const refundedFulfilmentsItems = getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.REFUNDED,
      { ...commonOptions, isRefunded: true }
    );

    const fulfilledFulfillmentsItems = getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.FULFILLED,
      commonOptions
    );

    return refundedFulfilmentsItems.concat(fulfilledFulfillmentsItems);
  };

  const fulfiledItemsQuatities = useFormset<LineItemData, number>(
    getItemsFulfilled()
  );

  const getItemsToBeReplaced = () => {
    if (!order) {
      return [];
    }

    const orderLinesItems = getOrderUnfulfilledLines(order).map(
      getParsedLineData({ initialValue: false })
    );

    const refundedFulfilmentsItems = getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.REFUNDED,
      { initialValue: false, isFulfillment: true }
    );

    const fulfilledFulfillmentsItems = getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.FULFILLED,
      { initialValue: false, isFulfillment: true }
    );

    return [
      ...orderLinesItems,
      ...refundedFulfilmentsItems,
      ...fulfilledFulfillmentsItems
    ];
  };

  const itemsToBeReplaced = useFormset<LineItemData, boolean>(
    getItemsToBeReplaced()
  );

  const handleSetMaximalUnfulfiledItemsQuantities = () => {
    const newQuantities: FormsetQuantityData = unfulfiledItemsQuantites.data.map(
      ({ id }) => {
        const line = order.lines.find(getById(id));
        const initialValue = line.quantity - line.quantityFulfilled;

        return getLineItem(line, { initialValue });
      }
    );

    triggerChange();
    unfulfiledItemsQuantites.set(newQuantities);
  };

  const handleSetMaximalFulfiledItemsQuantities = (
    fulfillmentId: string
  ) => () => {
    const { lines } = order.fulfillments.find(getById(fulfillmentId));

    const newQuantities: FormsetQuantityData = fulfiledItemsQuatities.data.map(
      item => {
        const line = lines.find(getById(item.id));

        if (!line) {
          return item;
        }

        return getLineItem(line, {
          initialValue: line.quantity,
          isRefunded: item.data.isRefunded
        });
      }
    );

    triggerChange();
    fulfiledItemsQuatities.set(newQuantities);
  };

  const data: OrderReturnFormData = {
    fulfilledItemsQuantities: fulfiledItemsQuatities.data,
    itemsToBeReplaced: itemsToBeReplaced.data,
    unfulfilledItemsQuantities: unfulfiledItemsQuantites.data,
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

  return <form>{children(props)}</form>;
};

export default OrderReturnForm;
