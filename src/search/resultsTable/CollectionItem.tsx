import { collectionUrl } from "@dashboard/collections/urls";
import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { LinkCell, Row, Thumbnail, TypeCell } from "./CommonCells";

type CollectionNode = NonNullable<GlobalSearchQuery["collections"]>["edges"][number]["node"];

export const CollectionItem = ({
  node,
  className,
  onClick,
}: {
  node: CollectionNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Row href={collectionUrl(node.id)} className={className} onClick={onClick}>
      <TypeCell href={collectionUrl(node.id)}>
        <FormattedMessage id="phAZoj" defaultMessage="Collection" />
      </TypeCell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={collectionUrl(node.id)}>
          <Box display="flex" alignItems="center" gap={5}>
            <Thumbnail url={node?.backgroundImage?.url} name={node?.name} />
            <Box
              display="flex"
              alignItems="start"
              justifyContent="center"
              flexDirection="column"
              gap={1}
            >
              <Text size={2} fontWeight="medium">
                {node?.name}
              </Text>
            </Box>
          </Box>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={collectionUrl(node.id)}>-</LinkCell>
      </GridTable.Cell>
    </Row>
  );
};
