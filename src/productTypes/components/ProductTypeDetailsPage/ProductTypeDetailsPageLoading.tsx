import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { ProductAttributeType } from "@dashboard/graphql";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductTypeAttributes from "../ProductTypeAttributes/ProductTypeAttributes";
import { messages as kindMessages } from "../ProductTypeKindTiles/messages";
import { ProductTypePdpSchematic } from "../ProductTypePdpSchematic/ProductTypePdpSchematic";
import { messages as shippingMessages } from "../ProductTypeShipping/messages";
import { messages as productTypeTaxesMessages } from "../ProductTypeTaxes/messages";
import ProductTypeVariantAttributes from "../ProductTypeVariantAttributes/ProductTypeVariantAttributes";
import { messages } from "./messages";
import { ProductTypeDetailsTitle } from "./Title";

const noop = (): void => undefined;

const idleListActions = {
  isChecked: (): boolean => false,
  selected: 0,
  toggle: noop,
  toggleAll: noop,
  toolbar: null,
};

interface ProductTypeDetailsPageLoadingProps {
  productTypeListBackLink: string;
  schematicDismissed: boolean;
  onShowMetadata: () => void;
}

export const ProductTypeDetailsPageLoading = ({
  productTypeListBackLink,
  schematicDismissed,
  onShowMetadata,
}: ProductTypeDetailsPageLoadingProps): ReactNode => {
  const intl = useIntl();

  return (
    <DetailPageLayout data-test-id="product-type-details-loading">
      <TopNav
        href={productTypeListBackLink}
        hrefIcon={<TopNavDestinationIcon.productTypes />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.allProductTypes)}
        title={<ProductTypeDetailsTitle loading />}
        actionsGap={3}
      >
        <TopNav.MetadataButton
          onClick={onShowMetadata}
          disabled
          data-test-id="show-product-type-metadata"
          title={intl.formatMessage(messages.editProductTypeMetadata)}
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
          {!schematicDismissed ? (
            <Box paddingBottom={6}>
              <ProductTypePdpSchematic
                loading
                hasVariants={false}
                productAttributes={undefined}
                assignedVariantAttributes={undefined}
                selectedVariantAttributeIds={[]}
                onDismiss={noop}
              />
            </Box>
          ) : null}
          <ProductTypeAttributes
            testId="assign-products-attributes"
            attributes={undefined}
            disabled
            type={ProductAttributeType.PRODUCT}
            onAttributeAssign={noop}
            onAttributeCreate={noop}
            onAttributeReorder={noop}
            onAttributeUnassign={noop}
            {...idleListActions}
          />
          <ProductTypeVariantAttributes
            testId="assign-variants-attributes"
            loading
            hasVariants={false}
            assignedVariantAttributes={undefined}
            disabled
            type={ProductAttributeType.VARIANT}
            onAttributeAssign={noop}
            onAttributeCreate={noop}
            onAttributeReorder={noop}
            onAttributeUnassign={noop}
            onHasVariantsToggle={noop}
            setSelectedVariantAttributes={noop}
            selectedVariantAttributes={[]}
            {...idleListActions}
          />
        </DetailPageContent>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar paddingTop={6} paddingX={6}>
        <Box display="flex" flexDirection="column" gap={4}>
          <DetailSettingsCard
            title={intl.formatMessage(commonMessages.generalInformations)}
            data-test-id="product-type-general-information"
          >
            <Box display="flex" flexDirection="column" gap={5} aria-busy="true">
              <Skeleton __height="2.5rem" />
              <Text size={3} fontWeight="medium">
                {intl.formatMessage(kindMessages.kindLabel)}
              </Text>
              <Skeleton __height="5.5rem" />
              <Skeleton __height="5.5rem" />
            </Box>
          </DetailSettingsCard>
          <DetailSettingsCard title={intl.formatMessage(shippingMessages.title)} contentFlush>
            <Box paddingX={6} paddingY={4} aria-busy="true">
              <Skeleton __height="3.5rem" />
            </Box>
          </DetailSettingsCard>
          <DetailSettingsCard
            title={intl.formatMessage(sectionNames.taxes)}
            intro={
              <Text size={3} color="default2">
                <FormattedMessage
                  {...productTypeTaxesMessages.intro}
                  values={{
                    taxSettingsLink: intl.formatMessage(taxesMessages.taxSettingsLink),
                  }}
                />
              </Text>
            }
          >
            <Box aria-busy="true">
              <Skeleton __height="2.5rem" />
            </Box>
          </DetailSettingsCard>
        </Box>
      </DetailPageLayout.RightSidebar>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton onClick={noop} disabled />
        <Savebar.ConfirmButton transitionState="default" disabled type="button" />
      </Savebar>
    </DetailPageLayout>
  );
};
