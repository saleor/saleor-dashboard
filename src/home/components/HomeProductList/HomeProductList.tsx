import { DashboardCard } from "@dashboard/components/Card";
import Money from "@dashboard/components/Money";
import Skeleton from "@dashboard/components/Skeleton";
import { HomeQuery } from "@dashboard/graphql";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { RelayToFlat } from "@dashboard/types";
import { Avatar, Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { HomeProductListItem } from "./HomeProductListItem";

// const useStyles = makeStyles(
//   theme => ({
//     avatarProps: {
//       height: 64,
//       width: 64,
//     },
//     colAvatar: {
//       paddingBottom: theme.spacing(2),
//       paddingRight: theme.spacing(),
//       paddingTop: theme.spacing(2),
//       width: 112,
//     },
//     colName: {
//       width: "auto",
//     },
//     label: {
//       paddingLeft: 0,
//     },
//     noProducts: {
//       paddingBottom: 20,
//       paddingTop: 20,
//       paddingLeft: "0 !important",
//     },
//     tableRow: {
//       cursor: "pointer",
//       /* Table to be replaced with Box */
//       "& .MuiTableCell-root": {
//         paddingLeft: `${vars.spacing[5]} !important`,
//         paddingRight: `${vars.spacing[5]} !important`,
//       },
//     },
//     cardContent: {
//       padding: 0,
//     },
//     cardTitle: {
//       padding: 0,
//     },
//   }),
//   { name: "HomeProductListCard" },
// );

interface HomeProductListProps {
  testId?: string;
  topProducts: RelayToFlat<HomeQuery["productTopToday"]>;
}

export const HomeProductList = ({
  topProducts,
  testId,
}: HomeProductListProps) => {
  const intl = useIntl();

  return (
    <DashboardCard data-test-id={testId}>
      <DashboardCard.Title>
        {intl.formatMessage({
          id: "rr8fyf",
          defaultMessage: "Top Products",
          description: "header",
        })}
      </DashboardCard.Title>
      <DashboardCard.Content>
        {renderCollection(
          topProducts,
          variant => (
            <HomeProductListItem
              key={variant ? variant.id : "skeleton"}
              linkUrl={productVariantEditUrl(variant.product.id, variant.id)}
            >
              {variant ? (
                <>
                  <Box display="flex" gap={4} alignItems="center">
                    <Avatar.User
                      size="medium"
                      src={variant.product.thumbnail.url}
                    />

                    <Box display="flex" flexDirection="column">
                      <Text>{variant.product.name}</Text>

                      <Text>
                        {variant.attributes
                          .map(attribute => attribute.values[0].name)
                          .join(" / ")}
                      </Text>

                      <Text>
                        <FormattedMessage
                          id="0opVvi"
                          defaultMessage="{amount, plural,one {One ordered}other {{amount} Ordered}}"
                          description="number of ordered products"
                          values={{
                            amount: variant.quantityOrdered,
                          }}
                        />
                      </Text>
                    </Box>
                  </Box>

                  <Text textAlign="right">
                    <Money money={variant.revenue.gross} />
                  </Text>
                </>
              ) : (
                <Skeleton />
              )}
            </HomeProductListItem>
          ),
          () => (
            <Box>
              <Text>
                <FormattedMessage
                  id="Q1Uzbb"
                  defaultMessage="No products found"
                />
              </Text>
            </Box>
          ),
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

HomeProductList.displayName = "HomeProductList";
export default HomeProductList;
