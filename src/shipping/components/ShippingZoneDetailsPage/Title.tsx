import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

interface ShippingZoneDetailsTitleProps {
  name?: string | null;
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
  { name: "ShippingZoneDetailsTitle" },
);

export const ShippingZoneDetailsTitle = ({ name, loading }: ShippingZoneDetailsTitleProps) => {
  const classes = useStyles();
  const isHeaderLoading = loading && !name;

  if (isHeaderLoading) {
    return (
      <div className={classes.container}>
        <Skeleton __width="12em" data-test-id="shipping-zone-details-title-skeleton" />
      </div>
    );
  }

  if (!name) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Box className={classes.name} title={name}>
        {name}
      </Box>
    </div>
  );
};
