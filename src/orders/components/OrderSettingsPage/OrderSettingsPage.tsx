import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Savebar } from "@dashboard/components/Savebar";
import { SettingsHubLayout } from "@dashboard/components/Settings/SettingsHubLayout";
import { SettingsPageContent } from "@dashboard/components/Settings/SettingsPageContent";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import {
  type OrderSettingsChannelsQuery,
  type ShopOrderSettingsFragment,
} from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { orderListUrl, type OrderSettingsUrlQueryParams } from "@dashboard/orders/urls";
import { parseQs } from "@dashboard/url-utils";
import { FormattedMessage, useIntl } from "react-intl";
import useRouter from "use-react-router";

import { OrderChannelSettingsMatrix } from "../OrderChannelSettingsMatrix/OrderChannelSettingsMatrix";
import { OrderCheckoutStockSettings } from "../OrderCheckoutStockSettings/OrderCheckoutStockSettings";
import OrderFulfillmentSettings from "../OrderFulfillmentSettings";
import { OrderReturnsRefundsSettingsCard } from "../OrderReturnsRefundsSettingsCard/OrderReturnsRefundsSettingsCard";
import OrderSettingsForm from "./form";
import { type OrderSettingsFormData } from "./types";

interface OrderSettingsPageProps {
  shop: ShopOrderSettingsFragment | undefined;
  channels: NonNullable<OrderSettingsChannelsQuery["channels"]>;
  canManageOrders: boolean;
  canManageSettings: boolean;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
}

const getOrdersSettingsExitHref = (search: string): string => {
  const params = parseQs(
    search.startsWith("?") ? search.slice(1) : search,
  ) as OrderSettingsUrlQueryParams;

  return params.from === "orders" ? orderListUrl() : configurationMenuUrl;
};

/**
 * Orders & fulfillment hub — uses SettingsHubLayout + SettingsPageContent like Refunds settings.
 */
const OrderSettingsPage = ({
  shop,
  channels,
  canManageOrders,
  canManageSettings,
  disabled,
  saveButtonBarState,
  onSubmit,
}: OrderSettingsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const {
    location: { search },
  } = useRouter();
  const exitHref = getOrdersSettingsExitHref(search);

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.ordersAndFulfillment)} />
      <SettingsHubLayout
        backHref={exitHref}
        title={intl.formatMessage({
          id: "anS/X1",
          defaultMessage: "Orders & fulfillment",
          description: "order settings hub page title",
        })}
      >
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
                {canManageOrders ? (
                  <OrderChannelSettingsMatrix
                    channels={channels}
                    channelSettings={data.channels}
                    dirtyChannelIds={dirtyChannelIds}
                    disabled={disabled}
                    onChannelChange={onChannelChange}
                  />
                ) : null}
                {canManageSettings ? (
                  <>
                    <OrderFulfillmentSettings data={data} disabled={disabled} onChange={change} />
                    <OrderCheckoutStockSettings data={data} disabled={disabled} onChange={change} />
                  </>
                ) : null}
                {canManageSettings ? <OrderReturnsRefundsSettingsCard /> : null}
              </SettingsPageContent>
              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(exitHref)} />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBarState}
                  onClick={submit}
                  disabled={isSaveDisabled}
                />
              </Savebar>
            </>
          )}
        </OrderSettingsForm>
      </SettingsHubLayout>
    </>
  );
};

OrderSettingsPage.displayName = "OrderSettingsPage";
export default OrderSettingsPage;
