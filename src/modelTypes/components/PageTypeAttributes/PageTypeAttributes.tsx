import { AssignedAttributesCard } from "@dashboard/attributes/components/AssignedAttributesCard/AssignedAttributesCard";
import { type AttributeFragment, type AttributeTypeEnum } from "@dashboard/graphql";
import { type ListActions, type ReorderAction } from "@dashboard/types";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface AssignedPageTypeAttribute extends AttributeFragment {
  valueRequired: boolean;
}

interface PageTypeAttributesProps extends ListActions {
  attributes: AssignedPageTypeAttribute[] | undefined;
  disabled: boolean;
  type: AttributeTypeEnum;
  onAttributeAssign: (type: AttributeTypeEnum) => void;
  onAttributeCreate: (type: AttributeTypeEnum) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
}

const PageTypeAttributes = ({
  attributes,
  disabled,
  type,
  onAttributeAssign,
  onAttributeCreate,
  onAttributeReorder,
  onAttributeUnassign,
  ...listActions
}: PageTypeAttributesProps): JSX.Element => {
  const intl = useIntl();

  return (
    <AssignedAttributesCard
      attributes={attributes}
      disabled={disabled}
      title={intl.formatMessage(messages.title)}
      intro={<FormattedMessage {...messages.intro} />}
      empty={<FormattedMessage {...messages.empty} />}
      cardTestId="page-attributes"
      assignTestId="assign-attributes"
      createTestId="create-attribute"
      createOptionLabel={intl.formatMessage(messages.createAttribute)}
      skeletonTestId="page-attributes-skeleton"
      onAttributeAssign={() => onAttributeAssign(type)}
      onAttributeCreate={() => onAttributeCreate(type)}
      onAttributeReorder={onAttributeReorder}
      onAttributeUnassign={onAttributeUnassign}
      {...listActions}
    />
  );
};

PageTypeAttributes.displayName = "PageTypeAttributes";
export default PageTypeAttributes;
