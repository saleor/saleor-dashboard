import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { CategoryItem } from "./CategoryItem";
import { CollectionItem } from "./CollectionItem";
import { ModelItem } from "./ModelItem";
import { ModelTypeItem } from "./ModelTypeItem";
import { OrderItem } from "./OrderItem";
import { prepareResults } from "./prepareResults";
import { ProductItem } from "./ProductItem";
import { VariantItem } from "./VariantItem";

interface ResultsTableProps {
  data: GlobalSearchQuery;
}

export const ResultsTable = ({ data }: ResultsTableProps) => {
  const results = prepareResults(data);

  if (results.empty) {
    return (
      <Text textAlign="center" paddingTop={32} color="default2" fontSize={4} fontWeight="medium">
        <FormattedMessage id="hX5PAb" defaultMessage="No results found" />
      </Text>
    );
  }

  return (
    <Box>
      {results.orders.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col __width="1%" />
            <GridTable.Col __width="1%" />
            <GridTable.Col __width="1%" />
            <GridTable.Col __width="1%" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {results.orders.map(result => (
              <OrderItem key={result.id} node={result} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {results.categories.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {results.categories.map(result => (
              <CategoryItem key={result.id} node={result} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {results.collections.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {results.collections.map(result => (
              <CollectionItem key={result.id} node={result} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {results.products.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {results.products.map(result => (
              <ProductItem key={result.id} node={result} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {results.productVariants.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {results.productVariants.map(result => (
              <VariantItem key={result.id} node={result} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {results.models.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {results.models.map(result => (
              <ModelItem key={result.id} node={result} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {results.modelTypes.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {results.modelTypes.map(result => (
              <ModelTypeItem key={result.id} node={result} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
    </Box>
  );
};
