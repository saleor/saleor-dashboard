import { ClickableProductType } from "@dashboard/components/ProductType/ProductType";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

interface ProductDetailsHeaderProduct {
  name: string;
  productType?: {
    id?: string;
    name?: string;
    slug?: string;
  } | null;
}

interface ProductDetailsTitleProps {
  product?: ProductDetailsHeaderProduct | null;
  loading?: boolean;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      gap: theme.spacing(2),
    },
    name: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  }),
  { name: "ProductDetailsTitle" },
);

export const ProductDetailsTitle = ({ product, loading }: ProductDetailsTitleProps) => {
  const classes = useStyles();

  const isHeaderLoading = loading && !product;

  if (isHeaderLoading) {
    return (
      <div className={classes.container}>
        <Skeleton __width="12em" data-test-id="product-details-title-skeleton" />
        <Skeleton __width="6rem" data-test-id="product-details-product-type-skeleton" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Box className={classes.name} title={product.name}>
        {product.name}
      </Box>
      {product.productType?.name && (
        <ClickableProductType
          productType={{
            id: product.productType.id,
            name: product.productType.name,
            slug: product.productType.slug,
          }}
          size={3}
        />
      )}
    </div>
  );
};
