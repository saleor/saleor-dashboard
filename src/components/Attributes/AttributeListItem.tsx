// @ts-strict-ignore
import {
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";

import AttributeRow from "./AttributeRow";
import { AttributeRowProps } from "./types";

type AttributeListItemProps = Omit<AttributeRowProps, "error"> & {
  errors: Array<ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment>;
  onAttributeSelectBlur: () => void;
};

export const AttributeListItem = ({
  errors,
  attribute,
  onAttributeSelectBlur,
  ...props
}: AttributeListItemProps) => {
  const error = errors.find(err => err.attributes?.includes(attribute.id));

  return (
    <AttributeRow
      attribute={attribute}
      error={error}
      onAttributeSelectBlur={onAttributeSelectBlur}
      {...props}
    />
  );
};
