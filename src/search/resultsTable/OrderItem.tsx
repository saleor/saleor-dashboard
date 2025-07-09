import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DisplayDate, LinkCell, Row, TypeCell } from "./CommonCells";
import { getPaymentLabel } from "./labels";

type OrderNode = NonNullable<GlobalSearchQuery["orders"]>["edges"][number]["node"];

export const OrderItem = ({ node }: { node: OrderNode }) => {
  const intl = useIntl();
  const { theme } = useTheme();

  const { color, localized } = getPaymentLabel(intl, theme, node.chargeStatus, node.paymentStatus);

  return (
    <Row>
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
              >
                {localized}
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Text fontSize={2} fontWeight="medium" color="default2">
                #
              </Text>
              <Text size={2} fontWeight="medium" color="default1">
                {node?.number}
              </Text>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Text size={2} fontWeight="medium" color="default2">
                {node?.total?.gross?.currency}
              </Text>
              <Text size={2} fontWeight="medium">
                {node?.total?.gross?.amount}
              </Text>
            </Box>
          </Box>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={orderUrl(node.id)}>
          <DisplayDate date={node?.updatedAt} />
        </LinkCell>
      </GridTable.Cell>
    </Row>
  );
};
