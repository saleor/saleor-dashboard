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
  selectionAttributesExist: boolean;
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
  selectionAttributesExist,
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
