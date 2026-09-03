import { AssignedAttributesCard } from "@dashboard/attributes/components/AssignedAttributesCard/AssignedAttributesCard";
import { type AttributeFragment, type AttributeTypeEnum } from "@dashboard/graphql";
import { type ListActions, type ReorderAction } from "@dashboard/types";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface AssignedCustomerTypeAttribute extends AttributeFragment {
  valueRequired: boolean;
}

interface CustomerTypeAttributesProps extends ListActions {
  attributes: AssignedCustomerTypeAttribute[] | undefined;
  disabled: boolean;
  type: AttributeTypeEnum;
  onAttributeAssign: (type: AttributeTypeEnum) => void;
  onAttributeCreate: (type: AttributeTypeEnum) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
}

export const CustomerTypeAttributes = ({
  attributes,
  disabled,
  type,
  onAttributeAssign,
  onAttributeCreate,
  onAttributeReorder,
  onAttributeUnassign,
  ...listActions
}: CustomerTypeAttributesProps): React.ReactNode => {
  const intl = useIntl();

  return (
    <AssignedAttributesCard
      attributes={attributes}
      disabled={disabled}
      title={intl.formatMessage(messages.title)}
      intro={<FormattedMessage {...messages.intro} />}
      empty={<FormattedMessage {...messages.empty} />}
      cardTestId="customer-attributes"
      assignTestId="assign-attributes"
      createTestId="create-attribute"
      createOptionLabel={intl.formatMessage(messages.createAttribute)}
      skeletonTestId="customer-attributes-skeleton"
      onAttributeAssign={() => onAttributeAssign(type)}
      onAttributeCreate={() => onAttributeCreate(type)}
      onAttributeReorder={onAttributeReorder}
      onAttributeUnassign={onAttributeUnassign}
      {...listActions}
    />
  );
};

CustomerTypeAttributes.displayName = "CustomerTypeAttributes";
