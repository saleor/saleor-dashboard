import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { ProductMediaFragment } from "@saleor/fragments/types/ProductMediaFragment";
import { ProductMediaType } from "@saleor/types/globalTypes";
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
  { name: "ProductVariantMedia" }
);

interface ProductVariantMediaProps {
  media?: ProductMediaFragment[];
  placeholderImage?: string;
  disabled: boolean;
  onImageAdd();
}

export const ProductVariantMedia: React.FC<ProductVariantMediaProps> = props => {
  const { disabled, media, onImageAdd } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Media",
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
              defaultMessage="Choose media"
              description="button"
            />
          </Button>
        }
      />
      <CardContent>
        <div className={classes.root}>
          {media === undefined || media === null ? (
            <Skeleton />
          ) : media.length > 0 ? (
            media
              .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1))
              .map(mediaObj => (
                <>
                  {mediaObj.type === ProductMediaType.VIDEO_YOUTUBE ? (
                    <iframe
                      className={classes.image}
                      title={mediaObj.alt}
                      src={mediaObj.url.replace("/watch?v=", "/embed/")}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      className={classes.image}
                      src={mediaObj.url}
                      alt={mediaObj.alt}
                    />
                  )}
                </>
              ))
          ) : (
            <Typography className={classes.helpText}>
              <FormattedMessage defaultMessage="Select a specific variant media from product media" />
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
ProductVariantMedia.displayName = "ProductVariantMedia";
export default ProductVariantMedia;
