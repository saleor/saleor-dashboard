import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailPageLayout } from "@dashboard/components/Layouts/Detail";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { Savebar } from "@dashboard/components/Savebar";
import { customerAddressesUrl } from "@dashboard/customers/urls";
import { CustomerGiftCardsCard } from "@dashboard/giftCards/components/GiftCardCustomerCard/CustomerGiftCardsCard";
import { PermissionEnum } from "@dashboard/graphql";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import CustomerAddresses from "../CustomerAddresses/CustomerAddresses";
import { messages as customerInfoMessages } from "../CustomerInfo/messages";
import { CustomerOrders } from "../CustomerOrders/CustomerOrders";
import { CustomerOverview } from "../CustomerOverview/CustomerOverview";
import { messages } from "./messages";
import { CustomerDetailsTitle } from "./Title";

const noop = (): void => undefined;

interface CustomerDetailsPageLoadingProps {
  canEditCustomers: boolean;
  customerBackLink: string;
  customerId: string;
  onShowMetadata: () => void;
}

export const CustomerDetailsPageLoading = ({
  canEditCustomers,
  customerBackLink,
  customerId,
  onShowMetadata,
}: CustomerDetailsPageLoadingProps): ReactNode => {
  const intl = useIntl();

  return (
    <DetailPageLayout data-test-id="customer-details-loading">
      <TopNav
        href={customerBackLink}
        hrefIcon={<TopNavDestinationIcon.customers />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.allCustomers)}
        title={<CustomerDetailsTitle loading />}
        actionsGap={3}
      >
        {canEditCustomers && (
          <TopNav.MetadataButton
            onClick={onShowMetadata}
            disabled
            data-test-id="show-customer-metadata"
            title={intl.formatMessage(messages.editCustomerMetadata)}
          />
        )}
        <TopNav.Menu
          items={[
            {
              label: intl.formatMessage(messages.openGraphiQL),
              onSelect: noop,
              testId: "graphiql-redirect",
              disabled: true,
              icon: <GraphqlIcon />,
            },
          ]}
          dataTestId="menu"
        />
      </TopNav>
      <DetailPageLayout.Content>
        <DetailPageContent>
          <CustomerOverview customer={undefined} />
          <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
            <CustomerOrders orders={undefined} viewAllHref="#" />
          </RequirePermissions>
          <DetailSettingsCard
            data-test-id="customer-attributes"
            title={intl.formatMessage(messages.attributesTitle)}
          >
            <Box aria-busy="true">
              <Skeleton __height="2.5rem" />
            </Box>
          </DetailSettingsCard>
        </DetailPageContent>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar paddingTop={6} paddingX={6}>
        <Box display="flex" flexDirection="column" gap={4}>
          <DetailSettingsCard
            data-test-id="customer-details"
            title={intl.formatMessage(customerInfoMessages.title)}
          >
            <Box aria-busy="true" display="flex" flexDirection="column" gap={5}>
              <Skeleton __height="2.5rem" />
              <Skeleton __height="2.5rem" />
              <Skeleton __height="2.5rem" />
              <Skeleton __height="5rem" />
            </Box>
          </DetailSettingsCard>
          <CustomerAddresses
            customer={undefined}
            disabled
            manageAddressHref={customerAddressesUrl(customerId)}
          />
          <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_GIFT_CARD]}>
            <CustomerGiftCardsCard />
          </RequirePermissions>
        </Box>
      </DetailPageLayout.RightSidebar>
      <Savebar>
        {canEditCustomers ? (
          <>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={noop} disabled />
            <Savebar.ConfirmButton transitionState="default" disabled type="button" />
          </>
        ) : (
          <Savebar.ReadOnlyLabel />
        )}
      </Savebar>
    </DetailPageLayout>
  );
};
