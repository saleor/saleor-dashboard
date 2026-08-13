import { AssignedAttributesCard } from "@dashboard/attributes/components/AssignedAttributesCard/AssignedAttributesCard";
import { type ProductAttributeType, type ProductTypeDetailsQuery } from "@dashboard/graphql";
import { type ListActions, type ReorderAction } from "@dashboard/types";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface ProductTypeAttributesProps extends ListActions {
  attributes: NonNullable<ProductTypeDetailsQuery["productType"]>["productAttributes"] | undefined;
  disabled: boolean;
  type: ProductAttributeType;
  testId?: string;
  onAttributeAssign: (type: ProductAttributeType) => void;
  onAttributeCreate: (type: ProductAttributeType) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
}

const ProductTypeAttributes = ({
  attributes,
  disabled,
  type,
  testId,
  onAttributeAssign,
  onAttributeCreate,
  onAttributeReorder,
  onAttributeUnassign,
  ...listActions
}: ProductTypeAttributesProps): JSX.Element => {
  const intl = useIntl();

  return (
    <AssignedAttributesCard
      attributes={attributes ?? undefined}
      disabled={disabled}
      title={intl.formatMessage(messages.title)}
      intro={<FormattedMessage {...messages.intro} />}
      empty={<FormattedMessage {...messages.empty} />}
      cardTestId="product-attributes"
      assignTestId={testId ?? "assign-products-attributes"}
      createTestId="create-product-attribute"
      createOptionLabel={intl.formatMessage({
        id: "LApQsw",
        defaultMessage: "Create attribute",
        description: "create attribute from product type, button",
      })}
      skeletonTestId="product-attributes-skeleton"
      variantColumn="spacer"
      onAttributeAssign={() => onAttributeAssign(type)}
      onAttributeCreate={() => onAttributeCreate(type)}
      onAttributeReorder={onAttributeReorder}
      onAttributeUnassign={onAttributeUnassign}
      {...listActions}
    />
  );
};

ProductTypeAttributes.displayName = "ProductTypeAttributes";
export default ProductTypeAttributes;
