import { GridTable } from "@dashboard/components/GridTable";
import { Box } from "@saleor/macaw-ui-next";

import { CategoryItem } from "./CategoryItem";
import { CollectionItem } from "./CollectionItem";
import { ModelItem } from "./ModelItem";
import { ModelTypeItem } from "./ModelTypeItem";
import { OrderItem } from "./OrderItem";
import { ItemData } from "./prepareResults";
import { ProductItem } from "./ProductItem";
import { VariantItem } from "./VariantItem";

interface ResultsTableProps {
  data: ItemData;
  onItemClick?: () => void;
}

export const ResultsTable = ({ data, onItemClick }: ResultsTableProps) => {
  return (
    <Box>
      {data.orders.length > 0 && (
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
            {data.orders.map(result => (
              <OrderItem key={result.id} node={result} onClick={onItemClick} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {data.categories.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {data.categories.map(result => (
              <CategoryItem key={result.id} node={result} onClick={onItemClick} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {data.collections.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {data.collections.map(result => (
              <CollectionItem key={result.id} node={result} onClick={onItemClick} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {data.products.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {data.products.map(result => (
              <ProductItem key={result.id} node={result} onClick={onItemClick} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {data.productVariants.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {data.productVariants.map(result => (
              <VariantItem key={result.id} node={result} onClick={onItemClick} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {data.models.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {data.models.map(result => (
              <ModelItem key={result.id} node={result} onClick={onItemClick} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
      {data.modelTypes.length > 0 && (
        <GridTable __marginBottom="-1px">
          <GridTable.Colgroup>
            <GridTable.Col __width="105px" />
            <GridTable.Col />
            <GridTable.Col __width="160px" />
          </GridTable.Colgroup>
          <GridTable.Body>
            {data.modelTypes.map(result => (
              <ModelTypeItem key={result.id} node={result} onClick={onItemClick} />
            ))}
          </GridTable.Body>
        </GridTable>
      )}
    </Box>
  );
};
