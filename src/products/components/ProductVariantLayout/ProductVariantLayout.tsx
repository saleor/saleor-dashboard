import { type ReactNode } from "react";

import styles from "./ProductVariantLayout.module.css";
import { useProductVariantLayout } from "./useProductVariantLayout";

interface ProductVariantLayoutProps {
  /** The product's variants: a list beside the form, or a switcher above it. */
  navigation: ReactNode;
  /** The variant form. */
  children: ReactNode;
}

/** Page body shared by the variant details and variant create pages. */
export const ProductVariantLayout = ({ navigation, children }: ProductVariantLayoutProps) => {
  const layout = useProductVariantLayout();

  return (
    <div className={styles.root} data-layout={layout} data-test-id="product-variant-layout">
      <div className={styles.navigation}>{navigation}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

ProductVariantLayout.displayName = "ProductVariantLayout";
