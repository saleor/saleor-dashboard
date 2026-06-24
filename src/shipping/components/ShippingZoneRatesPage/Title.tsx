import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";

interface ShippingMethodDetailsTitleProps {
  shippingZoneName?: string;
  rateName?: string | null;
  loading?: boolean;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      gap: theme.spacing(1),
      minWidth: 0,
    },
    zoneName: {
      flexShrink: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    methodName: {
      flexShrink: 0,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  }),
  { name: "ShippingMethodDetailsTitle" },
);

export const ShippingMethodDetailsTitle = ({
  shippingZoneName,
  rateName,
  loading,
}: ShippingMethodDetailsTitleProps) => {
  const classes = useStyles();
  const isHeaderLoading = loading && !rateName;

  if (isHeaderLoading) {
    return (
      <div className={classes.container}>
        <Skeleton __width="8em" data-test-id="shipping-method-zone-title-skeleton" />
        <Text size={6} color="default2">
          /
        </Text>
        <Skeleton __width="12em" data-test-id="shipping-method-details-title-skeleton" />
      </div>
    );
  }

  if (!rateName) {
    return null;
  }

  return (
    <div className={classes.container}>
      {shippingZoneName && (
        <>
          <Box className={classes.zoneName} title={shippingZoneName}>
            <Text size={6} color="default2">
              {shippingZoneName}
            </Text>
          </Box>
          <Text size={6} color="default2">
            /
          </Text>
        </>
      )}
      <Box className={classes.methodName} title={rateName}>
        <Text size={6}>{rateName}</Text>
      </Box>
    </div>
  );
};
