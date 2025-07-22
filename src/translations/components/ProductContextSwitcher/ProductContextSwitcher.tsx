import { useProductVariantListQuery } from "@dashboard/graphql";
import { Select, SelectProps } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

type ProductOrVariantId = string;

type BaseSelectProps = SelectProps<ProductOrVariantId, ProductOrVariantId>;
type CutProps = Omit<BaseSelectProps, "onChange" | "options" | "value">;

export interface ProductContextSwitcherProps extends CutProps {
  productId: string;
  selectedId: string;
  languageCode: string;
  onItemChange(id: string, type: "variant" | "main"): void;
}

export const ProductContextSwitcher: React.FC<ProductContextSwitcherProps> = ({
  languageCode,
  productId,
  selectedId,
  onItemChange,
  ...rest
}) => {
  const intl = useIntl();
  const { data } = useProductVariantListQuery({
    variables: { id: productId },
  });
  const items = [
    {
      label: intl.formatMessage({
        id: "QUyUJy",
        defaultMessage: "Main Product",
      }),
      value: productId,
      // onClick: () =>
      //   navigate(languageEntityUrl(languageCode, TranslatableEntities.products, productId)),
    },
    ...(data?.product?.variants?.map(({ name, sku, id }) => ({
      label: name ?? sku ?? id,
      value: id,
      // onClick: () => navigate(productVariantUrl(languageCode, productId, id)),
    })) || []),
  ];

  return (
    <Select
      {...rest}
      options={items}
      value={selectedId}
      label={intl.formatMessage({
        id: "tUlsq+",
        defaultMessage: "Translating",
      })}
      onChange={id => {
        onItemChange(id, id === productId ? "main" : "variant");
      }}
    />
  );
};

ProductContextSwitcher.displayName = "ProductContextSwitcher";
