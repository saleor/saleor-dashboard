import { AttributeInput, AttributeRowHandlers, Attributes } from "@dashboard/components/Attributes";
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import Link from "@dashboard/components/Link";
import {
  AttributeValueFragment,
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleHelp } from "lucide-react";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface VariantAttributesSectionProps extends AttributeRowHandlers {
  title: ReactNode;
  attributes: AttributeInput[];
  /** Total count of all variant attributes (selection + non-selection) */
  totalAttributesCount: number;
  selectionAttributesExist: boolean;
  /** Whether the product type supports variant attributes */
  hasVariants: boolean;
  attributeValues: AttributeValueFragment[];
  productTypeName: string;
  productTypeUrl: string;
  loading: boolean;
  errors: Array<ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment>;
  onAttributeSelectBlur: () => void;
  richTextGetters: RichTextGetters<string>;
}

export const VariantAttributesSection = ({
  title,
  attributes,
  totalAttributesCount,
  selectionAttributesExist,
  hasVariants,
  attributeValues,
  productTypeName,
  productTypeUrl,
  loading,
  errors,
  onChange,
  onMultiChange,
  onFileChange,
  onReferencesRemove,
  onReferencesAddClick,
  onReferencesReorder,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onAttributeSelectBlur,
  richTextGetters,
}: VariantAttributesSectionProps) => {
  const tooltipMessage = (
    <FormattedMessage
      id="3zoKGn"
      defaultMessage="Additional attributes for variant-specific information.{br}Can be adjusted in the {productTypeLink} settings."
      description="subtitle for variant attributes section"
      values={{
        br: <br />,
        productTypeLink: <Link href={productTypeUrl}>{productTypeName}</Link>,
      }}
    />
  );

  const emptyStateTitle = (
    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
      <Text size={5} fontWeight="bold">
        {title}
      </Text>
      <DashboardCard.Subtitle fontSize={3} color="default2">
        {tooltipMessage}
      </DashboardCard.Subtitle>
    </Box>
  );

  const titleWithTooltip = (
    <Box display="flex" alignItems="center" gap={2}>
      <Text size={5} fontWeight="bold">
        {title}
      </Text>
      <Tooltip>
        <Tooltip.Trigger>
          <Box color="default2" display="flex" alignItems="center">
            <CircleHelp size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">
          <Tooltip.Arrow />
          {tooltipMessage}
        </Tooltip.Content>
      </Tooltip>
    </Box>
  );

  // When hasVariants is false but attributes exist, show info message instead of attribute fields
  if (!hasVariants && totalAttributesCount > 0) {
    return (
      <>
        <CardSpacer />
        <DashboardCard paddingTop={6}>
          <DashboardCard.Content>
            <Box display="flex" flexDirection="column" gap={4} paddingBottom={4}>
              {titleWithTooltip}
              <Text size={2} color="default2">
                <FormattedMessage
                  id="zN0Eub"
                  defaultMessage="This product type has {count, plural, one {# variant attribute} other {# variant attributes}} defined, but 'Product type uses Variant Attributes' is disabled. Edit {productTypeLink} product type to enable variant attributes."
                  description="info message when hasVariants is false but variant attributes exist"
                  values={{
                    count: totalAttributesCount,
                    productTypeLink: (
                      <Link href={productTypeUrl} underline>
                        {productTypeName}
                      </Link>
                    ),
                  }}
                />
              </Text>
            </Box>
          </DashboardCard.Content>
        </DashboardCard>
      </>
    );
  }

  // Only show empty state when both non-selection and selection attributes are empty
  if (attributes.length === 0) {
    if (selectionAttributesExist) {
      return null;
    }

    return (
      <>
        <CardSpacer />
        <DashboardCard paddingTop={6}>
          <DashboardCard.Content>
            <Box display="flex" flexDirection="column" gap={1} paddingBottom={4}>
              {emptyStateTitle}
            </Box>
          </DashboardCard.Content>
        </DashboardCard>
      </>
    );
  }

  return (
    <>
      <CardSpacer />
      <Attributes
        title={titleWithTooltip}
        attributes={attributes}
        attributeValues={attributeValues}
        loading={loading}
        disabled={loading}
        errors={errors}
        onChange={onChange}
        onMultiChange={onMultiChange}
        onFileChange={onFileChange}
        onReferencesRemove={onReferencesRemove}
        onReferencesAddClick={onReferencesAddClick}
        onReferencesReorder={onReferencesReorder}
        fetchAttributeValues={fetchAttributeValues}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onAttributeSelectBlur={onAttributeSelectBlur}
        richTextGetters={richTextGetters}
      />
    </>
  );
};
