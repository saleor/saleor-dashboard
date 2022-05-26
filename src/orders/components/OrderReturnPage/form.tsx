import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { FulfillmentStatus, OrderDetailsFragment } from "@saleor/graphql";
import useForm, {
  CommonUseFormResultWithHandlers,
  SubmitPromise,
} from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData,
} from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import React, { useEffect } from "react";

import { OrderRefundAmountCalculationMode } from "../OrderRefundPage/form";
import {
  getById,
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
  changeWaitingItemsQuantity: FormsetChange<number>;
  changeUnfulfiledItemsQuantity: FormsetChange<number>;
  changeItemsToBeReplaced: FormsetChange<boolean>;
  handleSetMaximalItemsQuantities;
  handleSetMaximalUnfulfiledItemsQuantities;
}

export interface OrderReturnFormData extends OrderReturnData {
  itemsToBeReplaced: FormsetReplacementData;
  fulfilledItemsQuantities: FormsetQuantityData;
  waitingItemsQuantities: FormsetQuantityData;
  unfulfilledItemsQuantities: FormsetQuantityData;
}

export type OrderRefundSubmitData = OrderReturnFormData;

export type UseOrderRefundFormResult = CommonUseFormResultWithHandlers<
  OrderReturnFormData,
  OrderReturnHandlers
>;

interface OrderReturnProps {
  children: (props: UseOrderRefundFormResult) => React.ReactNode;
  order: OrderDetailsFragment;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

const getOrderRefundPageFormData = (): OrderReturnData => ({
  amount: undefined,
  amountCalculationMode: OrderRefundAmountCalculationMode.AUTOMATIC,
  refundShipmentCosts: false,
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

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId,
  });

  const unfulfiledItemsQuantites = useFormset<LineItemData, number>(
    getOrderUnfulfilledLines(order).map(getParsedLineData({ initialValue: 0 })),
  );

  const getItemsFulfilled = () => {
    const commonOptions = {
      initialValue: 0,
      isFulfillment: true,
    };

    const refundedFulfilmentsItems = getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.REFUNDED,
      { ...commonOptions, isRefunded: true },
    );

    const fulfilledFulfillmentsItems = getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.FULFILLED,
      commonOptions,
    );

    return refundedFulfilmentsItems.concat(fulfilledFulfillmentsItems);
  };

  const getItemsWaiting = () => {
    const commonOptions = {
      initialValue: 0,
      isFulfillment: true,
    };

    return getParsedLineDataForFulfillmentStatus(
      order,
      FulfillmentStatus.WAITING_FOR_APPROVAL,
      commonOptions,
    );
  };

  const fulfiledItemsQuatities = useFormset<LineItemData, number>(
    getItemsFulfilled(),
  );

  const waitingItemsQuantities = useFormset<LineItemData, number>(
    getItemsWaiting(),
  );

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

  const itemsToBeReplaced = useFormset<LineItemData, boolean>(
    getItemsToBeReplaced(),
  );

  const handleSetMaximalUnfulfiledItemsQuantities = () => {
    const newQuantities: FormsetQuantityData = unfulfiledItemsQuantites.data.map(
      ({ id }) => {
        const line = order.lines.find(getById(id));
        const initialValue = line.quantityToFulfill;

        return getLineItem(line, { initialValue });
      },
    );

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
      triggerChange();
      callback(id, value);
    };
  }

  const hasAnyItemsSelected =
    fulfiledItemsQuatities.data.some(({ value }) => !!value) ||
    waitingItemsQuantities.data.some(({ value }) => !!value) ||
    unfulfiledItemsQuantites.data.some(({ value }) => !!value);

  const isSaveDisabled = !hasAnyItemsSelected;
  setIsSubmitDisabled(isSaveDisabled);

  return {
    change: handleChange,
    data,
    handlers: {
      changeFulfiledItemsQuantity: handleHandlerChange(
        fulfiledItemsQuatities.change,
      ),
      changeWaitingItemsQuantity: handleHandlerChange(
        waitingItemsQuantities.change,
      ),
      changeItemsToBeReplaced: handleHandlerChange(itemsToBeReplaced.change),
      changeUnfulfiledItemsQuantity: handleHandlerChange(
        unfulfiledItemsQuantites.change,
      ),
      handleSetMaximalItemsQuantities,
      handleSetMaximalUnfulfiledItemsQuantities,
    },
    submit,
    isSaveDisabled,
  };
}

const OrderReturnForm: React.FC<OrderReturnProps> = ({
  children,
  order,
  onSubmit,
}) => {
  const props = useOrderReturnForm(order, onSubmit);

  return <form>{children(props)}</form>;
};

export default OrderReturnForm;
