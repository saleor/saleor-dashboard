import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { pageTypeUrl } from "@dashboard/modelTypes/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { LinkCell, Row, TypeCell } from "./CommonCells";

type ModelTypeNode = NonNullable<GlobalSearchQuery["modelTypes"]>["edges"][number]["node"];

export const ModelTypeItem = ({
  node,
  className,
  onClick,
}: {
  node: ModelTypeNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Row href={pageTypeUrl(node.id)} className={className} onClick={onClick}>
      <TypeCell href={pageTypeUrl(node.id)}>
        <FormattedMessage id="9FCrIN" defaultMessage="Model type" />
      </TypeCell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={pageTypeUrl(node.id)}>
          <Box display="flex" alignItems="center" gap={2} width="100%">
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
        <LinkCell href={pageTypeUrl(node.id)}>-</LinkCell>
      </GridTable.Cell>
    </Row>
  );
};
