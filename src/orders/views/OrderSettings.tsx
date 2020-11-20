import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { getMutationState } from "@saleor/misc";
import OrderSettingsPage from "@saleor/orders/components/OrderSettingsPage";
import { OrderSettingsFormData } from "@saleor/orders/components/OrderSettingsPage/form";
import { useOrderSettingsUpdateMutation } from "@saleor/orders/mutations";
import { useOrderSettingsQuery } from "@saleor/orders/queries";
import { orderListUrl } from "@saleor/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

export const OrderSettings: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const { data, loading } = useOrderSettingsQuery({});

  const [
    orderSettingsUpdate,
    orderSettingsUpdateOpts
  ] = useOrderSettingsUpdateMutation({});

  const handleSubmit = async (data: OrderSettingsFormData) => {
    const result = await orderSettingsUpdate({
      variables: {
        input: data
      }
    });

    const errors = result.data?.orderSettingsUpdate.errors;
    if (errors.length) {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong)
      });
      return errors;
    }

    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges)
    });
    return [];
  };

  const handleBack = () => navigate(orderListUrl());

  return (
    <OrderSettingsPage
      data={data?.orderSettings}
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
