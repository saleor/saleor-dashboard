import { ProductTypeKindEnum } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";

export const makeProductTypeKindChangeHandler = (
  onChange: FormChange,
  onKindChange: (kind: ProductTypeKindEnum) => void,
) => (event: React.ChangeEvent<any>) => {
  const kind = event.target.value as ProductTypeKindEnum;
  onKindChange(kind);
  onChange(event);
};
