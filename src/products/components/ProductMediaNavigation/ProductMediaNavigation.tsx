import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  allMedia: {
    id: "XUU9sU",
    defaultMessage: "All Media",
    description: "section header",
  },
});

const useStyles = makeStyles(
  theme => ({
    card: {
      marginBottom: theme.spacing(2),
    },
    highlightedImageContainer: {
      borderColor: theme.palette.primary.main,
    },
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%",
    },
    imageContainer: {
      border: "2px solid #eaeaea",
      borderRadius: theme.spacing(),
      cursor: "pointer",
      height: 48,
      overflow: "hidden",
      padding: theme.spacing(0.5),
      position: "relative",
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(1),
      gridTemplateColumns: "repeat(4, 1fr)",
    },
    toolbar: { marginTop: theme.spacing(-0.5) },
  }),
  { name: "ProductMediaNavigation" },
);

interface ProductMediaNavigationProps {
  disabled: boolean;
  media?: Array<{
    id: string;
    url: string;
    alt?: string;
    type?: string;
    oembedData?: string;
  }>;
  highlighted?: string;
  onRowClick: (id: string) => () => void;
}

const ProductMediaNavigation: React.FC<ProductMediaNavigationProps> = props => {
  const { highlighted, media, onRowClick } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card className={classes.card}>
      <CardTitle title={intl.formatMessage(messages.allMedia)} />
      <CardContent>
        {!media ? (
          <Skeleton />
        ) : (
          <div className={classes.root}>
            {media.map(mediaObj => {
              const mediaObjOembedData = JSON.parse(mediaObj?.oembedData);
              const mediaUrl =
                mediaObjOembedData?.thumbnail_url || mediaObj.url;

              return (
                <div
                  className={classNames({
                    [classes.imageContainer]: true,
                    [classes.highlightedImageContainer]:
                      mediaObj.id === highlighted,
                  })}
                  onClick={onRowClick(mediaObj.id)}
                  key={mediaObj.id}
                >
                  <img
                    className={classes.image}
                    src={mediaUrl}
                    alt={mediaObj.alt}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
ProductMediaNavigation.displayName = "ProductMediaNavigation";
export default ProductMediaNavigation;
