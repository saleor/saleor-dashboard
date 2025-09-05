import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { productUrl } from "@dashboard/products/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { DisplayDate, LinkCell, Row, Thumbnail, TypeCell } from "./CommonCells";

type ProductNode = NonNullable<GlobalSearchQuery["products"]>["edges"][number]["node"];

export const ProductItem = ({
  node,
  className,
  onClick,
}: {
  node: ProductNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Row href={productUrl(node.id)} className={className} onClick={onClick}>
      <TypeCell href={productUrl(node.id)}>
        <FormattedMessage id="x/ZVlU" defaultMessage="Product" />
      </TypeCell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={productUrl(node.id)}>
          <Box display="flex" alignItems="center" gap={5}>
            <Thumbnail url={node?.thumbnail?.url} name={node?.name} />
            <Text size={2} fontWeight="medium">
              {node?.name}
            </Text>
            <Text size={2} fontWeight="medium" color="default2">
              {node?.category?.name}
            </Text>
          </Box>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={productUrl(node.id)}>
          <DisplayDate date={node?.updatedAt} />
        </LinkCell>
      </GridTable.Cell>
    </Row>
  );
};
