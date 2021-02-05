import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { ProductMediaType } from "@saleor/types/globalTypes";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import videoPlaceholderIcon from "../../../../assets/images/video-placeholder.svg";

const useStyles = makeStyles(
  theme => ({
    card: {
      marginBottom: theme.spacing(2)
    },
    highlightedImageContainer: {
      borderColor: theme.palette.primary.main
    },
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%"
    },
    imageContainer: {
      background: "#ffffff",
      border: "2px solid #eaeaea",
      borderRadius: theme.spacing(),
      cursor: "pointer",
      height: 48,
      overflow: "hidden",
      padding: theme.spacing(0.5),
      position: "relative"
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(1),
      gridTemplateColumns: "repeat(4, 1fr)"
    },
    toolbar: { marginTop: -theme.spacing(0.5) }
  }),
  { name: "ProductMediaNavigation" }
);

interface ProductMediaNavigationProps {
  disabled: boolean;
  media?: Array<{
    id: string;
    url: string;
    alt?: string;
    type?: string;
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
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "All Media",
          description: "section header"
        })}
      />
      <CardContent>
        {media === undefined ? (
          <Skeleton />
        ) : (
          <div className={classes.root}>
            {media.map(mediaObj => (
              <div
                className={classNames({
                  [classes.imageContainer]: true,
                  [classes.highlightedImageContainer]:
                    mediaObj.id === highlighted
                })}
                onClick={onRowClick(mediaObj.id)}
                key={mediaObj.id}
              >
                <img
                  className={classes.image}
                  src={
                    mediaObj.type && mediaObj.type !== ProductMediaType.IMAGE
                      ? videoPlaceholderIcon
                      : mediaObj.url
                  }
                  alt={mediaObj.alt}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
ProductMediaNavigation.displayName = "ProductMediaNavigation";
export default ProductMediaNavigation;
