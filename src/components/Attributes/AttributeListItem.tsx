// @ts-strict-ignore
import AttributeRow from "./AttributeRow";
import { type AttributeFieldError, type AttributeRowProps } from "./types";

type AttributeListItemProps = Omit<AttributeRowProps, "error"> & {
  errors: AttributeFieldError[];
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
