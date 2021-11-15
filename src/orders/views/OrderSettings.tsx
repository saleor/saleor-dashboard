import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors, getMutationState } from "@saleor/misc";
import OrderSettingsPage from "@saleor/orders/components/OrderSettingsPage";
import { useOrderSettingsUpdateMutation } from "@saleor/orders/mutations";
import { useOrderSettingsQuery } from "@saleor/orders/queries";
import { orderListUrl } from "@saleor/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

import { OrderSettingsFormData } from "../components/OrderSettingsPage/types";

export const OrderSettings: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const { data, loading } = useOrderSettingsQuery({});

  const [
    orderSettingsUpdate,
    orderSettingsUpdateOpts
  ] = useOrderSettingsUpdateMutation({
    onCompleted: ({ orderSettingsUpdate: { errors } }) => {
      if (!errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        return;
      }

      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong)
      });
    }
  });

  const handleBack = () => navigate(orderListUrl());

  const handleSubmit = async ({
    automaticallyConfirmAllNewOrders,
    automaticallyFulfillNonShippableGiftCard,
    fulfillmentAutoApprove,
    fulfillmentAllowUnpaid
  }: OrderSettingsFormData) =>
    extractMutationErrors(
      orderSettingsUpdate({
        variables: {
          orderSettingsInput: {
            automaticallyFulfillNonShippableGiftCard,
            automaticallyConfirmAllNewOrders
          },
          shopSettingsInput: {
            fulfillmentAutoApprove,
            fulfillmentAllowUnpaid
          }
        }
      })
    );

  return (
    <OrderSettingsPage
      orderSettings={data?.orderSettings}
      shop={data?.shop}
      disabled={loading || orderSettingsUpdateOpts.loading}
      onSubmit={handleSubmit}
      onBack={handleBack}
      saveButtonBarState={getMutationState(
        orderSettingsUpdateOpts.called,
        orderSettingsUpdateOpts.loading,
        [...(orderSettingsUpdateOpts.data?.orderSettingsUpdate.errors || [])]
      )}
    />
  );
};
export default OrderSettings;
