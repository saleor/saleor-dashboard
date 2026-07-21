import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import {
  type AssignableSearchProduct,
  isVariantsListTruncated,
} from "@dashboard/searches/mapSearchProductsForVariantAssign";
import { TableCell } from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface AssignVariantLoadMoreRowProps {
  product: AssignableSearchProduct | null | undefined;
  loading: boolean;
  loadingProduct: boolean;
  onLoadMore: (productId: string) => void;
}

export const AssignVariantLoadMoreRow = ({
  product,
  loading,
  loadingProduct,
  onLoadMore,
}: AssignVariantLoadMoreRowProps) => {
  const intl = useIntl();

  if (!product || !isVariantsListTruncated(product)) {
    return null;
  }

  return (
    <TableRowLink data-test-id="load-more-variants">
      <TableCell />
      <TableCell colSpan={3}>
        <Box display="flex" flexDirection="column" alignItems="flex-start" gap={3} paddingY={4}>
          <Button
            type="button"
            variant="secondary"
            disabled={loading || loadingProduct}
            onClick={() => {
              void onLoadMore(product.id);
            }}
          >
            {loadingProduct ? (
              <Box display="flex" alignItems="center" gap={2}>
                <SaleorThrobber size={16} />
                {intl.formatMessage(messages.loadingMoreVariants)}
              </Box>
            ) : (
              intl.formatMessage(messages.loadMoreVariants)
            )}
          </Button>
          {product.variantsTotalCount !== null && (
            <Text size={3} color="default2" data-test-id="load-more-variants-progress">
              {intl.formatMessage(messages.loadMoreVariantsProgress, {
                loaded: product.variants.length,
                total: product.variantsTotalCount,
              })}
            </Text>
          )}
        </Box>
      </TableCell>
    </TableRowLink>
  );
};
