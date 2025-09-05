import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { productVariantEditPath } from "@dashboard/products/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { DisplayDate, LinkCell, Row, Thumbnail, TypeCell } from "./CommonCells";

type VariantNode = NonNullable<GlobalSearchQuery["productVariants"]>["edges"][number]["node"];

export const VariantItem = ({
  node,
  className,
  onClick,
}: {
  node: VariantNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Row href={productVariantEditPath(node.id)} className={className} onClick={onClick}>
      <TypeCell href={productVariantEditPath(node.id)}>
        <FormattedMessage id="OK5+Fh" defaultMessage="Variant" />
      </TypeCell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={productVariantEditPath(node.id)}>
          <Box display="flex" alignItems="center" gap={5} width="100%">
            <Thumbnail url={node?.media?.[0]?.url} name={node?.name} />
            <Text size={2} fontWeight="medium">
              {node?.product?.name} • {node?.name}
            </Text>
            <Text size={2} fontWeight="medium" color="default2">
              {node?.product?.category?.name}
            </Text>
          </Box>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={productVariantEditPath(node.id)}>
          <DisplayDate date={node?.updatedAt} />
        </LinkCell>
      </GridTable.Cell>
    </Row>
  );
};
