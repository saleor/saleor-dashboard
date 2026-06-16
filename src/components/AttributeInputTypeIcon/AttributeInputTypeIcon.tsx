import { getAttributeInputTypeLabel } from "@dashboard/attributes/utils/getAttributeInputTypeLabel";
import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { AttributeLabelIcon } from "./AttributeLabelIcon";
import { getAttributeInputTypeIcon } from "./getAttributeInputTypeIcon";
import { type AttributeInputTypeIconSize } from "./types";

interface AttributeInputTypeIconProps {
  inputType: AttributeInputTypeEnum;
  size?: AttributeInputTypeIconSize;
}

export const AttributeInputTypeIcon = ({
  inputType,
  size = "small",
}: AttributeInputTypeIconProps): JSX.Element => {
  const intl = useIntl();

  return (
    <AttributeLabelIcon
      icon={getAttributeInputTypeIcon(inputType)}
      size={size}
      ariaLabel={getAttributeInputTypeLabel(intl, inputType)}
    />
  );
};
