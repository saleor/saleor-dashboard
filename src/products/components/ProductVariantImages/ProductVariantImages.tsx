import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { ProductImage } from "../../types/ProductImage";

const styles = (theme: Theme) =>
  createStyles({
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
      borderRadius: theme.spacing.unit,
      height: theme.spacing.unit * 17.5,
      marginBottom: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridTemplateColumns: "repeat(4, 1fr)"
    }
  });

interface ProductVariantImagesProps extends WithStyles<typeof styles> {
  images?: ProductImage[];
  placeholderImage?: string;
  disabled: boolean;
  onImageAdd();
}

export const ProductVariantImages = withStyles(styles, {
  name: "ProductVariantImages"
})(({ classes, disabled, images, onImageAdd }: ProductVariantImagesProps) => {
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
});
ProductVariantImages.displayName = "ProductVariantImages";
export default ProductVariantImages;
