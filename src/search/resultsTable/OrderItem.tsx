import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { DisplayDate, LinkCell, Row, TypeCell } from "./CommonCells";
import { getPaymentLabel } from "./labels";

type OrderNode = NonNullable<GlobalSearchQuery["orders"]>["edges"][number]["node"];

export const OrderItem = ({
  node,
  className,
  onClick,
}: {
  node: OrderNode;
  className?: string;
  onClick?: () => void;
}) => {
  const intl = useIntl();
  const { theme } = useTheme();

  const { color, localized } = getPaymentLabel(intl, theme, node.chargeStatus, node.paymentStatus);

  return (
    <Row href={orderUrl(node.id)} className={className} onClick={onClick}>
      <TypeCell href={orderUrl(node.id)}>
        <FormattedMessage id="XPruqs" defaultMessage="Order" />
      </TypeCell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={orderUrl(node.id)}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={5}>
            <Box>
              <Box
                __backgroundColor={color.base}
                __color={color.text}
                __borderColor={color.border}
                paddingX={1.5}
                paddingY={0.5}
                borderRadius={3}
                fontSize={1}
                display="inline-block"
                style={{ textWrap: "nowrap" }}
              >
                {localized}
              </Box>
            </Box>
          </Box>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={orderUrl(node.id)}>
          <Box display="flex" alignItems="center" gap={0.5} paddingLeft={5}>
            <Text fontSize={2} fontWeight="medium" color="default2">
              #
            </Text>
            <Text size={2} fontWeight="medium" color="default1">
              {node?.number}
            </Text>
          </Box>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={orderUrl(node.id)}>
          <Text size={2} fontWeight="medium" color="default2" paddingLeft={5}>
            {node?.total?.gross?.currency}
          </Text>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={orderUrl(node.id)}>
          <Text
            size={2}
            fontWeight="medium"
            textAlign="right"
            paddingLeft={2}
            width="100%"
            style={{ textWrap: "nowrap", fontVariantNumeric: "tabular-nums" }}
          >
            {node?.total?.gross?.amount}
          </Text>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={orderUrl(node.id)} />
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={orderUrl(node.id)}>
          <DisplayDate date={node?.updatedAt} />
        </LinkCell>
      </GridTable.Cell>
    </Row>
  );
};
