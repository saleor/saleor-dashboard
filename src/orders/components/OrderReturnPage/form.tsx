// @ts-strict-ignore
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { FulfillmentStatus, OrderDetailsFragment } from "@dashboard/graphql";
import useForm, { CommonUseFormResultWithHandlers, SubmitPromise } from "@dashboard/hooks/useForm";
import useFormset, { FormsetChange, FormsetData } from "@dashboard/hooks/useFormset";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { getById } from "@dashboard/misc";
import React, { useEffect } from "react";

import { OrderRefundAmountCalculationMode } from "../OrderRefundPage/form";
import { useFulfillmentFormset } from "./useFulfillmentFormset";
import {
  getLineItem,
  getOrderUnfulfilledLines,
  getParsedLineData,
  getParsedLineDataForFulfillmentStatus,
} from "./utils";

export interface LineItemOptions<T> {
  initialValue: T;
  isFulfillment?: boolean;
  isRefunded?: boolean;
}

export interface LineItemData {
  isFulfillment: boolean;
  isRefunded: boolean;
  orderLineId: string;
}

export type FormsetQuantityData = FormsetData<LineItemData, number>;
export type FormsetReplacementData = FormsetData<LineItemData, boolean>;

export interface OrderReturnData {
  amount: number;
  refundShipmentCosts: boolean;
  autoGrantRefund: boolean;
  autoSendRefund: boolean;
  amountCalculationMode: OrderRefundAmountCalculationMode;
}

interface OrderReturnHandlers {
  changeFulfiledItemsQuantity: FormsetChange<number>;
  changeWaitingItemsQuantity: FormsetChange<number>;
  changeUnfulfiledItemsQuantity: FormsetChange<number>;
  changeItemsToBeReplaced: FormsetChange<boolean>;
  handleSetMaximalItemsQuantities;
  handleSetMaximalUnfulfiledItemsQuantities;
  handleAmountChange: (value: number) => void;
}

export interface OrderReturnFormData extends OrderReturnData {
  itemsToBeReplaced: FormsetReplacementData;
  fulfilledItemsQuantities: FormsetQuantityData;
  waitingItemsQuantities: FormsetQuantityData;
  unfulfilledItemsQuantities: FormsetQuantityData;
}

export type OrderRefundSubmitData = OrderReturnFormData;

type UseOrderRefundFormResult = CommonUseFormResultWithHandlers<
  OrderReturnFormData,
  OrderReturnHandlers
> & { isAmountDirty: boolean };

interface OrderReturnProps {
  children: (props: UseOrderRefundFormResult) => React.ReactNode;
  order: OrderDetailsFragment;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

const getOrderRefundPageFormData = (): OrderReturnData => ({
  amount: undefined,
  amountCalculationMode: OrderRefundAmountCalculationMode.AUTOMATIC,
  refundShipmentCosts: false,
  autoGrantRefund: false,
  autoSendRefund: false,
});

function useOrderReturnForm(
  order: OrderDetailsFragment,
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise,
): UseOrderRefundFormResult {
  const {
    handleChange,
    data: formData,
    triggerChange,
    formId,
    setIsSubmitDisabled,
  } = useForm(getOrderRefundPageFormData(), undefined, {
    confirmLeave: true,
  });
  const [isAmountDirty, setAmountDirty] = React.useState(false);
  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId,
  });

  const {
    fulfiledItemsQuatities,
    waitingItemsQuantities,
    unfulfiledItemsQuantites,
    disabled: isSaveDisabled,
  } = useFulfillmentFormset({
    order,
    formData,
  });

  const getItemsToBeReplaced = () => {
    if (!order) {
      return [];
    }

    const orderLinesItems = getOrderUnfulfilledLines(order).map(
      getParsedLineData({ initialValue: false }),
    );
    const refundedFulfilmentsItems = getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.REFUNDED,
      { initialValue: false, isFulfillment: true },
    );
    const fulfilledFulfillmentsItems = getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.FULFILLED,
      { initialValue: false, isFulfillment: true },
    );
    const waitingFulfillmentsItems = getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.WAITING_FOR_APPROVAL,
      { initialValue: false, isFulfillment: true },
    );

    return [
      ...orderLinesItems,
      ...refundedFulfilmentsItems,
      ...fulfilledFulfillmentsItems,
      ...waitingFulfillmentsItems,
    ];
  };
  const itemsToBeReplaced = useFormset<LineItemData, boolean>(getItemsToBeReplaced());
  const handleSetMaximalUnfulfiledItemsQuantities = () => {
    const newQuantities: FormsetQuantityData = unfulfiledItemsQuantites.data.map(({ id }) => {
      const line = order.lines.find(getById(id));
      const initialValue = line.quantityToFulfill;

      return getLineItem(line, { initialValue });
    });

    triggerChange();
    unfulfiledItemsQuantites.set(newQuantities);
  };
  const handleSetMaximalItemsQuantities = (fulfillmentId: string) => () => {
    const fulfillment = order.fulfillments.find(getById(fulfillmentId));
    const quantities =
      fulfillment.status === FulfillmentStatus.WAITING_FOR_APPROVAL
        ? waitingItemsQuantities
        : fulfiledItemsQuatities;
    const newQuantities: FormsetQuantityData = quantities.data.map(item => {
      const line = fulfillment.lines.find(getById(item.id));

      if (!line) {
        return item;
      }

      return getLineItem(line, {
        initialValue: line.quantity,
        isRefunded: item.data.isRefunded,
      });
    });

    triggerChange();
    quantities.set(newQuantities);
  };
  const handleAmountChange = (value: number) => {
    setAmountDirty(true);
    handleChange({
      target: {
        name: "amount",
        value,
      },
    });
  };
  const data: OrderReturnFormData = {
    fulfilledItemsQuantities: fulfiledItemsQuatities.data,
    waitingItemsQuantities: waitingItemsQuantities.data,
    itemsToBeReplaced: itemsToBeReplaced.data,
    unfulfilledItemsQuantities: unfulfiledItemsQuantites.data,
    ...formData,
  };
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });
  const submit = () => handleFormSubmit(data);

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  function handleHandlerChange<T>(callback: (id: string, value: T) => void) {
    return (id: string, value: T) => {
      setAmountDirty(false);
      triggerChange();
      callback(id, value);
    };
  }

  setIsSubmitDisabled(isSaveDisabled);

  return {
    change: handleChange,
    data,
    isAmountDirty,
    handlers: {
      changeFulfiledItemsQuantity: handleHandlerChange(fulfiledItemsQuatities.change),
      changeWaitingItemsQuantity: handleHandlerChange(waitingItemsQuantities.change),
      changeItemsToBeReplaced: handleHandlerChange(itemsToBeReplaced.change),
      changeUnfulfiledItemsQuantity: handleHandlerChange(unfulfiledItemsQuantites.change),
      handleSetMaximalItemsQuantities,
      handleSetMaximalUnfulfiledItemsQuantities,
      handleAmountChange,
    },
    submit,
    isSaveDisabled,
  };
}

const OrderReturnForm: React.FC<OrderReturnProps> = ({ children, order, onSubmit }) => {
  const props = useOrderReturnForm(order as OrderDetailsFragment, onSubmit);

  return <form>{children(props)}</form>;
};

export default OrderReturnForm;
