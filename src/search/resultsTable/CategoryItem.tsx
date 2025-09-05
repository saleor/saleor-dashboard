import { categoryUrl } from "@dashboard/categories/urls";
import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { DisplayDate, LinkCell, Row, Thumbnail, TypeCell } from "./CommonCells";
import { getCategoryHierarchyLabel } from "./labels";

type CategoryNode = NonNullable<GlobalSearchQuery["categories"]>["edges"][number]["node"];

export const CategoryItem = ({
  node,
  className,
  onClick,
}: {
  node: CategoryNode;
  className?: string;
  onClick?: () => void;
}) => {
  const ancestorsLabel = getCategoryHierarchyLabel(node);

  return (
    <Row href={categoryUrl(node.id)} className={className} onClick={onClick}>
      <TypeCell href={categoryUrl(node.id)}>
        <FormattedMessage id="ccXLVi" defaultMessage="Category" />
      </TypeCell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={categoryUrl(node.id)}>
          <Box display="flex" alignItems="center" gap={5}>
            <Thumbnail url={node?.backgroundImage?.url} name={node?.name} />
            <Text size={2} fontWeight="medium">
              {node?.name}
            </Text>
            <Text size={2} fontWeight="medium" color="default2">
              {ancestorsLabel}
            </Text>
          </Box>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={categoryUrl(node.id)}>
          <DisplayDate date={node?.updatedAt} />
        </LinkCell>
      </GridTable.Cell>
    </Row>
  );
};
