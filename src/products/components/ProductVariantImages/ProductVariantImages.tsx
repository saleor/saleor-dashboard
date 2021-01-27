import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { ProductImageFragment } from "@saleor/fragments/types/ProductImageFragment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    gridElement: {
      "& img": {
        width: "100%"
      }
    },
    helpText: {
      gridColumnEnd: "span 4"
    },
    image: {
      height: "100%",
      objectFit: "contain",
      width: "100%"
    },
    imageContainer: {
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      height: theme.spacing(17.5),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2)
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "repeat(4, 1fr)"
    }
  }),
  { name: "ProductVariantImages" }
);

interface ProductVariantImagesProps {
  images?: ProductImageFragment[];
  placeholderImage?: string;
  disabled: boolean;
  onImageAdd();
}

export const ProductVariantImages: React.FC<ProductVariantImagesProps> = props => {
  const { disabled, images, onImageAdd } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Images",
          description: "section header"
        })}
        toolbar={
          <Button
            color="primary"
            variant="text"
            disabled={disabled}
            onClick={onImageAdd}
          >
            <FormattedMessage
              defaultMessage="Choose photos"
              description="button"
            />
          </Button>
        }
      />
      <CardContent>
        <div className={classes.root}>
          {images === undefined || images === null ? (
            <Skeleton />
          ) : images.length > 0 ? (
            images
              .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1))
              .map(tile => (
                <div className={classes.imageContainer} key={tile.id}>
                  <img className={classes.image} src={tile.url} />
                </div>
              ))
          ) : (
            <Typography className={classes.helpText}>
              <FormattedMessage defaultMessage="Select a specific variant image from product images" />
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
ProductVariantImages.displayName = "ProductVariantImages";
export default ProductVariantImages;
