import { rippleAttributeViewOverhaul } from "@dashboard/attributes/ripples/attributeViewOverhaul";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { commonMessages } from "@dashboard/intl";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { AttributeDetailsTitle } from "./Title";

const noop = (): void => undefined;

interface AttributePageLoadingProps {
  attributePageBackLink: string;
  onShowMetadata?: () => void;
}

export const AttributePageLoading = ({
  attributePageBackLink,
  onShowMetadata,
}: AttributePageLoadingProps): ReactNode => {
  const intl = useIntl();

  return (
    <DetailPageLayout data-test-id="attribute-details-loading">
      <TopNav
        href={attributePageBackLink}
        hrefIcon={<TopNavDestinationIcon.attributes />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.allAttributes)}
        title={<AttributeDetailsTitle loading />}
        actionsGap={3}
      >
        {onShowMetadata ? (
          <TopNav.MetadataButton
            onClick={onShowMetadata}
            disabled
            data-test-id="show-attribute-metadata"
            title={intl.formatMessage(messages.editAttributeMetadata)}
            ripple={rippleAttributeViewOverhaul}
          />
        ) : null}
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
          <DetailSettingsCard
            data-test-id="attribute-general-information"
            title={intl.formatMessage(commonMessages.generalInformations)}
          >
            <Box display="flex" flexDirection="column" gap={5} aria-busy="true">
              <Skeleton __height="2.5rem" />
              <Skeleton __height="2.5rem" />
              <Skeleton __height="2.5rem" />
            </Box>
          </DetailSettingsCard>
        </DetailPageContent>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar paddingTop={6} paddingX={6}>
        <DetailSettingsCard
          title={intl.formatMessage(commonMessages.properties)}
          contentFlush
          data-test-id="attribute-properties"
        >
          <Box
            paddingX={6}
            paddingY={4}
            display="flex"
            flexDirection="column"
            gap={4}
            aria-busy="true"
          >
            <Skeleton __height="3.5rem" />
            <Skeleton __height="3.5rem" />
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
