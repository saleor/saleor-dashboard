import { GridTable } from "@dashboard/components/GridTable";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

export const ListSkeleton = () => {
  return (
    <GridTable>
      <GridTable.Colgroup>
        <GridTable.Col __width="60px" />
        <GridTable.Col />
        <GridTable.Col __width="160px" />
      </GridTable.Colgroup>
      <GridTable.Body>
        {Array.from({ length: 10 }).map((_, index) => (
          <GridTable.Row __height="38px" key={index}>
            <GridTable.Cell __height="inherit" padding={0}>
              <Box paddingLeft={6}>
                <Skeleton height={4} />
              </Box>
            </GridTable.Cell>
            <GridTable.Cell __height="inherit" padding={0}>
              <Box paddingLeft={3}>
                <Skeleton height={4} __width="40%" />
              </Box>
            </GridTable.Cell>
            <GridTable.Cell __height="inherit" padding={0} />
          </GridTable.Row>
        ))}
      </GridTable.Body>
    </GridTable>
  );
};
