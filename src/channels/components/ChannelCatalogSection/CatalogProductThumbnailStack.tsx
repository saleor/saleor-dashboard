import { productUrl } from "@dashboard/products/urls";
import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Package } from "lucide-react";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import styles from "./CatalogProductThumbnailStack.module.css";
import { messages } from "./messages";

export interface CatalogProductThumbnail {
  id: string;
  name: string;
  thumbnailUrl?: string | null;
}

interface CatalogProductThumbnailStackProps {
  products: CatalogProductThumbnail[];
  className?: string;
}

export const CatalogProductThumbnailStack = ({
  products,
  className,
}: CatalogProductThumbnailStackProps) => {
  const intl = useIntl();

  if (products.length === 0) {
    return null;
  }

  return (
    <Box
      as="ul"
      className={clsx(styles.stack, className)}
      aria-label={intl.formatMessage(messages.recentlyPublishedThumbnails)}
      data-test-id="recently-published-thumbnails"
    >
      {products.map(product => (
        <Box as="li" key={product.id} className={styles.item}>
          <RouterLink
            to={productUrl(product.id)}
            className={styles.link}
            title={product.name}
            aria-label={product.name}
            data-test-id={`recently-published-thumbnail-${product.id}`}
          >
            {product.thumbnailUrl ? (
              <img src={product.thumbnailUrl} alt="" className={styles.image} loading="lazy" />
            ) : (
              <span className={styles.placeholder} aria-hidden>
                <Package className={styles.placeholderIcon} />
              </span>
            )}
          </RouterLink>
        </Box>
      ))}
    </Box>
  );
};
