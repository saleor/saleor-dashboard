import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";

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
  { name: "ProductImageNavigation" }
);

interface ProductImageNavigationProps {
  disabled: boolean;
  images?: Array<{
    id: string;
    url: string;
  }>;
  highlighted?: string;
  onRowClick: (id: string) => () => void;
}

const ProductImageNavigation: React.FC<ProductImageNavigationProps> = props => {
  const { highlighted, images, onRowClick } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "All Photos",
          description: "section header"
        })}
      />
      <CardContent>
        {images === undefined ? (
          <Skeleton />
        ) : (
          <div className={classes.root}>
            {images.map(image => (
              <div
                className={classNames({
                  [classes.imageContainer]: true,
                  [classes.highlightedImageContainer]: image.id === highlighted
                })}
                onClick={onRowClick(image.id)}
                key={image.id}
              >
                <img className={classes.image} src={image.url} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
ProductImageNavigation.displayName = "ProductImageNavigation";
export default ProductImageNavigation;
