import { ClickableAttributeClass } from "@dashboard/components/AttributeClass/AttributeClass";
import { type AttributeTypeEnum } from "@dashboard/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

interface AttributeDetailsHeaderAttribute {
  name: string;
  type?: AttributeTypeEnum | null;
}

interface AttributeDetailsTitleProps {
  attribute?: AttributeDetailsHeaderAttribute | null;
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
  { name: "AttributeDetailsTitle" },
);

export const AttributeDetailsTitle = ({ attribute, loading }: AttributeDetailsTitleProps) => {
  const classes = useStyles();

  const isHeaderLoading = loading && !attribute;

  if (isHeaderLoading) {
    return (
      <div className={classes.container}>
        <Skeleton __width="12em" data-test-id="attribute-details-title-skeleton" />
        <Skeleton __width="6rem" data-test-id="attribute-details-class-skeleton" />
      </div>
    );
  }

  if (!attribute) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Box className={classes.name} title={attribute.name}>
        {attribute.name}
      </Box>
      {attribute.type && <ClickableAttributeClass attributeType={attribute.type} size={3} />}
    </div>
  );
};
