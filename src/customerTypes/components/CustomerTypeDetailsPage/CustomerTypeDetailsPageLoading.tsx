import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { CustomerTypeAttributes } from "@dashboard/customerTypes/components/CustomerTypeAttributes/CustomerTypeAttributes";
import { AttributeTypeEnum } from "@dashboard/graphql";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { commonMessages } from "@dashboard/intl";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { CustomerTypeDetailsTitle } from "./Title";

const noop = (): void => undefined;

const idleListActions = {
  isChecked: (): boolean => false,
  selected: 0,
  toggle: noop,
  toggleAll: noop,
  toolbar: null,
};

interface CustomerTypeDetailsPageLoadingProps {
  customerTypeListBackLink: string;
  onShowMetadata: () => void;
}

export const CustomerTypeDetailsPageLoading = ({
  customerTypeListBackLink,
  onShowMetadata,
}: CustomerTypeDetailsPageLoadingProps): ReactNode => {
  const intl = useIntl();

  return (
    <DetailPageLayout data-test-id="customer-type-details-loading">
      <TopNav
        href={customerTypeListBackLink}
        hrefIcon={<TopNavDestinationIcon.customerTypes />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.allCustomerTypes)}
        title={<CustomerTypeDetailsTitle loading />}
        actionsGap={3}
      >
        <TopNav.MetadataButton
          onClick={onShowMetadata}
          disabled
          data-test-id="show-customer-type-metadata"
          title={intl.formatMessage(messages.editCustomerTypeMetadata)}
        />
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
          <CustomerTypeAttributes
            attributes={undefined}
            disabled
            type={AttributeTypeEnum.CUSTOMER_TYPE}
            onAttributeAssign={noop}
            onAttributeCreate={noop}
            onAttributeReorder={noop}
            onAttributeUnassign={noop}
            {...idleListActions}
          />
        </DetailPageContent>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar paddingTop={6} paddingX={6}>
        <DetailSettingsCard
          title={intl.formatMessage(commonMessages.generalInformations)}
          data-test-id="customer-type-general-information"
        >
          <Box aria-busy="true">
            <Skeleton __height="2.5rem" />
          </Box>
        </DetailSettingsCard>
      </DetailPageLayout.RightSidebar>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton onClick={noop} disabled />
        <Savebar.ConfirmButton transitionState="default" disabled type="button" />
      </Savebar>
    </DetailPageLayout>
  );
};
