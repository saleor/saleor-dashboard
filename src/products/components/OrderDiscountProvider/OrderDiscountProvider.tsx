import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { OrderDiscountCommonInput } from "@saleor/orders/components/OrderDiscountCommonModal/types";
import {
  useOrderDiscountAddMutation,
  useOrderDiscountDeleteMutation,
  useOrderDiscountUpdateMutation
} from "@saleor/orders/mutations";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { OrderDiscountAdd } from "@saleor/orders/types/OrderDiscountAdd";
import { OrderDiscountDelete } from "@saleor/orders/types/OrderDiscountDelete";
import { OrderDiscountUpdate } from "@saleor/orders/types/OrderDiscountUpdate";
import React, { createContext } from "react";
import { useIntl } from "react-intl";

import {
  getDiscountNotifierData,
  getParsedMoneyData,
  useDiscountDialog
} from "../OrderLineDiscountProvider/utils";
import { OrderDiscountData } from "./types";
import { getManualOrderDiscount, getParsedDiscountData } from "./utils";

export interface OrderDiscountConsumerProps {
  discountCurrency: string;
  discountMaxAmount: number;
  orderDiscountAddStatus: ConfirmButtonTransitionState;
  orderDiscountRemoveStatus: ConfirmButtonTransitionState;
  orderDiscount?: OrderDiscountData;
  addOrderDiscount: (data: OrderDiscountCommonInput) => void;
  removeOrderDiscount: () => void;
  isDiscountDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

interface OrderDiscountProviderProps {
  children: React.ReactNode;
  order?: OrderDetails_order;
}

const DiscountContext = createContext<OrderDiscountConsumerProps>(null);

export const OrderDiscountProvider: React.FC<OrderDiscountProviderProps> = ({
  children,
  order
}) => {
  const intl = useIntl();
  const notify = useNotifier();
  const shop = useShop();

  const { id: orderId, undiscountedTotal } = order;

  const { isDialogOpen, openDialog, closeDialog } = useDiscountDialog();

  const orderDiscount = getManualOrderDiscount(order);

  const [orderDiscountAdd, orderDiscountAddOpts] = useOrderDiscountAddMutation({
    onCompleted: ({ orderDiscountAdd: { errors } }: OrderDiscountAdd) =>
      handleDiscountDataSubmission(errors)
  });

  const [
    orderDiscountUpdate,
    orderDiscountUpdateOpts
  ] = useOrderDiscountUpdateMutation({
    onCompleted: ({ orderDiscountUpdate: { errors } }: OrderDiscountUpdate) =>
      handleDiscountDataSubmission(errors)
  });

  const [
    orderDiscountRemove,
    orderDiscountRemoveOpts
  ] = useOrderDiscountDeleteMutation({
    onCompleted: ({ orderDiscountDelete: { errors } }: OrderDiscountDelete) =>
      handleDiscountDataSubmission(errors)
  });

  const handleDiscountDataSubmission = (errors: any[]) => {
    closeDialog();
    notify(getDiscountNotifierData(errors, intl));
  };

  const addOrderDiscount = (data: OrderDiscountCommonInput) =>
    orderDiscountAdd({
      variables: {
        orderId,
        input: getParsedDiscountData(data)
      }
    });

  const updateOrderDiscount = (data: OrderDiscountCommonInput) =>
    orderDiscount &&
    orderDiscountUpdate({
      variables: {
        discountId: orderDiscount?.id,
        input: getParsedDiscountData(data)
      }
    });

  const removeOrderDiscount = () =>
    orderDiscount &&
    orderDiscountRemove({ variables: { discountId: orderDiscount.id } });

  const orderDiscountAction = orderDiscount
    ? updateOrderDiscount
    : addOrderDiscount;

  const orderDiscountAddStatus = orderDiscount
    ? orderDiscountUpdateOpts.status
    : orderDiscountAddOpts.status;

  const moneyData = getParsedMoneyData(
    shop.includeTaxesInPrices ? undiscountedTotal.gross : undiscountedTotal.net
  );

  const discountProviderValues: OrderDiscountConsumerProps = {
    orderDiscountAddStatus,
    orderDiscountRemoveStatus: orderDiscountRemoveOpts.status,
    orderDiscount,
    addOrderDiscount: orderDiscountAction,
    removeOrderDiscount,
    isDiscountDialogOpen: isDialogOpen,
    closeDialog,
    openDialog,
    ...moneyData
  };

  return (
    <DiscountContext.Provider value={discountProviderValues}>
      {children}
    </DiscountContext.Provider>
  );
};

interface DiscountConsumerProps {
  children: React.ReactNode;
}

export const OrderDiscountConsumer: React.FC<DiscountConsumerProps> = ({
  children
}) => (
  <DiscountContext.Consumer>
    {(values: OrderDiscountConsumerProps) => children(values)}
  </DiscountContext.Consumer>
);
