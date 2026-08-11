import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Package } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface ProductListEmptyStateProps {
  /** True when search or filters may explain an empty result. */
  hasSearchOrFilters?: boolean;
  onAdd: () => void;
  disabled?: boolean;
}

/**
 * Catalog-first empty state for the products list. Filter/search misses keep
 * quieter copy; a true empty shop gets a create CTA.
 */
export const ProductListEmptyState = ({
  hasSearchOrFilters = false,
  onAdd,
  disabled = false,
}: ProductListEmptyStateProps) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={3}
    paddingY={10}
    paddingX={6}
    data-test-id="product-list-empty"
  >
    <Box color="default2" aria-hidden>
      <Package size={28} strokeWidth={1.5} />
    </Box>
    <Box display="flex" flexDirection="column" alignItems="center" gap={1} __maxWidth="28rem">
      <Text size={4} fontWeight="medium" textAlign="center">
        <FormattedMessage
          {...(hasSearchOrFilters ? messages.emptyFilteredTitle : messages.emptyCatalogTitle)}
        />
      </Text>
      <Text size={2} color="default2" textAlign="center">
        <FormattedMessage
          {...(hasSearchOrFilters
            ? messages.emptyFilteredDescription
            : messages.emptyCatalogDescription)}
        />
      </Text>
    </Box>
    {!hasSearchOrFilters ? (
      <Button
        variant="primary"
        onClick={onAdd}
        disabled={disabled}
        data-test-id="product-list-empty-create"
      >
        <FormattedMessage {...messages.emptyCatalogAction} />
      </Button>
    ) : null}
  </Box>
);
