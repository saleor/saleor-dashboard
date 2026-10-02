import { AttributeLabelIcon } from "@dashboard/components/AttributeInputTypeIcon/AttributeLabelIcon";
import {
  attributeInputTypeIconPixelSize,
  type AttributeInputTypeIconSize,
  attributeInputTypeIconStrokeWidthBySize,
} from "@dashboard/components/AttributeInputTypeIcon/types";
import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { ModelingLabelIcon } from "@dashboard/icons/Modeling";
import { Box } from "@saleor/macaw-ui-next";
import { FolderTree, type LucideIcon, Tag, Tags } from "lucide-react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  page: {
    id: "c7cakc",
    defaultMessage: "Models",
    description: "model attribute entity type",
  },
  product: {
    id: "5TUpjG",
    defaultMessage: "Products",
    description: "product attribute entity type",
  },
  productVariant: {
    id: "wsDF7X",
    defaultMessage: "Product variants",
    description: "product variant attribute entity type",
  },
  category: {
    id: "KzgcFV",
    defaultMessage: "Categories",
    description: "category attribute entity type",
  },
  collection: {
    id: "Crn8DZ",
    defaultMessage: "Collections",
    description: "collection attribute entity type",
  },
});

const referenceEntityIcons: Record<Exclude<AttributeEntityTypeEnum, "PAGE">, LucideIcon> = {
  [AttributeEntityTypeEnum.PRODUCT]: Tag,
  [AttributeEntityTypeEnum.PRODUCT_VARIANT]: Tag,
  [AttributeEntityTypeEnum.CATEGORY]: FolderTree,
  [AttributeEntityTypeEnum.COLLECTION]: Tags,
};

const referenceEntityLabels: Record<
  AttributeEntityTypeEnum,
  (typeof messages)[keyof typeof messages]
> = {
  [AttributeEntityTypeEnum.PRODUCT]: messages.product,
  [AttributeEntityTypeEnum.PRODUCT_VARIANT]: messages.productVariant,
  [AttributeEntityTypeEnum.PAGE]: messages.page,
  [AttributeEntityTypeEnum.CATEGORY]: messages.category,
  [AttributeEntityTypeEnum.COLLECTION]: messages.collection,
};

interface AttributeReferenceEntityIconProps {
  entityType: AttributeEntityTypeEnum | null | undefined;
  size?: AttributeInputTypeIconSize;
}

/** Which kind of record a reference attribute points at, shown beside the reference-type icon. */
export const AttributeReferenceEntityIcon = ({
  entityType,
  size = "xsmall",
}: AttributeReferenceEntityIconProps): React.ReactNode => {
  const intl = useIntl();

  if (!entityType) {
    return null;
  }

  const label = intl.formatMessage(referenceEntityLabels[entityType]);

  if (entityType === AttributeEntityTypeEnum.PAGE) {
    return (
      <Box
        color="default2"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink="0"
        aria-label={label}
      >
        <ModelingLabelIcon
          size={attributeInputTypeIconPixelSize[size]}
          strokeWidth={attributeInputTypeIconStrokeWidthBySize[size]}
        />
      </Box>
    );
  }

  return (
    <AttributeLabelIcon icon={referenceEntityIcons[entityType]} size={size} ariaLabel={label} />
  );
};
