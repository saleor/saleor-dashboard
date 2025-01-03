// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { OrderSettingsFragment, ShopOrderSettingsFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderListUrl } from "@dashboard/orders/urls";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import OrderFulfillmentSettings from "../OrderFulfillmentSettings";
import OrderSettings from "../OrderSettings/OrderSettings";
import OrderSettingsForm from "./form";
import { OrderSettingsFormData } from "./types";

export interface OrderSettingsPageProps {
  orderSettings: OrderSettingsFragment;
  shop: ShopOrderSettingsFragment;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
}

const OrderSettingsPage = (props: OrderSettingsPageProps) => {
  const { orderSettings, shop, disabled, saveButtonBarState, onSubmit } = props;
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <OrderSettingsForm
      orderSettings={orderSettings}
      shop={shop}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, submit, change, isSaveDisabled }) => (
        <DetailPageLayout gridTemplateColumns={1}>
          <TopNav
            href={orderListUrl()}
            title={intl.formatMessage({
              id: "Vu9nol",
              defaultMessage: "Order settings",
              description: "header",
            })}
          />
          <DetailPageLayout.Content>
            <Box margin="auto" height="100vh">
              <OrderSettings data={data} disabled={disabled} onChange={change} />
              <OrderFulfillmentSettings data={data} disabled={disabled} onChange={change} />
            </Box>
          </DetailPageLayout.Content>
          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(orderListUrl())} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={isSaveDisabled}
            />
          </Savebar>
        </DetailPageLayout>
      )}
    </OrderSettingsForm>
  );
};

OrderSettingsPage.displayName = "OrderSettingsPage";
export default OrderSettingsPage;
