import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { pageUrl } from "@dashboard/modeling/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { DisplayDate, LinkCell, Row, TypeCell } from "./CommonCells";

type ModelNode = NonNullable<GlobalSearchQuery["models"]>["edges"][number]["node"];

export const ModelItem = ({
  node,
  className,
  onClick,
}: {
  node: ModelNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Row href={pageUrl(node.id)} className={className} onClick={onClick}>
      <TypeCell href={pageUrl(node.id)}>
        <FormattedMessage id="rhSI1/" defaultMessage="Model" />
      </TypeCell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={pageUrl(node.id)}>
          <Box display="flex" alignItems="center" gap={5} width="100%">
            <Text size={2} fontWeight="medium">
              {node?.title}
            </Text>
            <Text size={2} fontWeight="medium" color="default2">
              {node?.pageType?.name}
            </Text>
          </Box>
        </LinkCell>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <LinkCell href={pageUrl(node.id)}>
          <DisplayDate date={node?.publishedAt} />
        </LinkCell>
      </GridTable.Cell>
    </Row>
  );
};
