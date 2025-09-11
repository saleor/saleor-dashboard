import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";
import { useIntl } from "react-intl";

const ListValue = ({ children, last }: { children: ReactNode; last?: boolean }) => {
  return (
    <>
      <span
        style={{
          userSelect: "all",
        }}
      >
        {children}
      </span>
      {!last && <span aria-hidden="true">,</span>}
    </>
  );
};

const ListItem = ({
  name,
  value,
  last,
}: {
  name: string;
  value: string | number | undefined;
  last?: boolean;
}) => {
  return (
    <Box as="dl" marginY={0} display="flex">
      <Box as="dt">
        {name}
        <span aria-hidden="true">:</span>
      </Box>
      <Box as="dd" marginLeft={1}>
        <ListValue last={last}>{value}</ListValue>
      </Box>
    </Box>
  );
};

export const OrderLineSubheaderData = ({
  productSku,
  quantity,
  variantName,
  loading,
}: {
  productSku: string | null | undefined;
  quantity: number | undefined;
  variantName: string | undefined;
  loading: boolean;
}) => {
  const intl = useIntl();

  if (loading) {
    // Hidden text that adds height, so that we don't have movement once data loads
    return <Skeleton width={52} height={5} />;
  }

  return (
    <Text as="span" display="flex" gap={1}>
      {productSku && (
        <ListItem
          name={intl.formatMessage({
            defaultMessage: "SKU",
            description: "orderLine.productSku, subheader, order line metadata dialog",
            id: "h6MWxB",
          })}
          value={productSku}
        />
      )}
      <ListItem
        name={intl.formatMessage({
          defaultMessage: "Variant",
          id: "IHTyjM",
          description: "orderLine.variant.name, subheader, order line metadata dialog",
        })}
        value={variantName}
      />
      <ListItem
        name={intl.formatMessage({
          defaultMessage: "Qty",
          id: "NL5C12",
          description: "orderLine.quantity, subheader, oredr line metadata dialog",
        })}
        value={quantity}
        last
      />
    </Text>
  );
};
