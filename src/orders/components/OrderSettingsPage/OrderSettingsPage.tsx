import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { SettingsPageContent } from "@dashboard/components/Settings/SettingsPageContent";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import {
  type OrderSettingsChannelsQuery,
  type ShopOrderSettingsFragment,
} from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderChannelSettingsMatrix } from "../OrderChannelSettingsMatrix/OrderChannelSettingsMatrix";
import { OrderCheckoutStockSettings } from "../OrderCheckoutStockSettings/OrderCheckoutStockSettings";
import OrderFulfillmentSettings from "../OrderFulfillmentSettings";
import { OrderReturnsRefundsSettingsCard } from "../OrderReturnsRefundsSettingsCard/OrderReturnsRefundsSettingsCard";
import OrderSettingsForm from "./form";
import { type OrderSettingsFormData } from "./types";

interface OrderSettingsPageProps {
  shop: ShopOrderSettingsFragment | undefined;
  channels: NonNullable<OrderSettingsChannelsQuery["channels"]>;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
}

/**
 * Layout mirrors RefundsSettingsPage / SiteSettingsPage:
 * DetailPageLayout (1-col) → TopNav + Content → form inside Content (not wrapping the layout).
 * TopNav/Content use gridColumn="full" because macaw defaults them to span 8.
 */
const OrderSettingsPage = ({
  shop,
  channels,
  disabled,
  saveButtonBarState,
  onSubmit,
}: OrderSettingsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <DetailPageLayout gridTemplateColumns={1} width="100%">
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage({
          id: "anS/X1",
          defaultMessage: "Orders & fulfillment",
          description: "order settings hub page title",
        })}
        gridColumn="full"
      />
      <DetailPageLayout.Content gridColumn="full" width="100%">
        <OrderSettingsForm shop={shop} channels={channels} onSubmit={onSubmit} disabled={disabled}>
          {({ data, submit, change, isSaveDisabled, dirtyChannelIds, onChannelChange }) => (
            <>
              <SettingsPageContent
                description={
                  <FormattedMessage
                    id="mShMMI"
                    defaultMessage="Compare and adjust shop-wide and per-channel order policies on one page. Open a channel for checkout and payment settings."
                    description="intro under orders and fulfillment settings page title"
                  />
                }
              >
                <OrderChannelSettingsMatrix
                  channels={channels}
                  channelSettings={data.channels}
                  dirtyChannelIds={dirtyChannelIds}
                  disabled={disabled}
                  onChannelChange={onChannelChange}
                />
                <OrderFulfillmentSettings data={data} disabled={disabled} onChange={change} />
                <OrderCheckoutStockSettings data={data} disabled={disabled} onChange={change} />
                <OrderReturnsRefundsSettingsCard />
              </SettingsPageContent>
              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(configurationMenuUrl)} />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBarState}
                  onClick={submit}
                  disabled={isSaveDisabled}
                />
              </Savebar>
            </>
          )}
        </OrderSettingsForm>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

OrderSettingsPage.displayName = "OrderSettingsPage";
export default OrderSettingsPage;
