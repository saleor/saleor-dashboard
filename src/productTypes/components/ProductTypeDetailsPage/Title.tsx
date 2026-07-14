import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

interface ProductTypeDetailsHeaderProductType {
  name: string;
}

interface ProductTypeDetailsTitleProps {
  productType?: ProductTypeDetailsHeaderProductType | null;
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
  { name: "ProductTypeDetailsTitle" },
);

export const ProductTypeDetailsTitle = ({ productType, loading }: ProductTypeDetailsTitleProps) => {
  const classes = useStyles();
  const isHeaderLoading = loading && !productType;

  if (isHeaderLoading) {
    return (
      <div className={classes.container}>
        <Skeleton __width="12em" data-test-id="product-type-details-title-skeleton" />
      </div>
    );
  }

  if (!productType) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Box className={classes.name} title={productType.name}>
        {productType.name}
      </Box>
    </div>
  );
};
