import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

interface PageTypeDetailsHeaderPageType {
  name: string;
}

interface PageTypeDetailsTitleProps {
  pageType?: PageTypeDetailsHeaderPageType | null;
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
  { name: "PageTypeDetailsTitle" },
);

export const PageTypeDetailsTitle = ({ pageType, loading }: PageTypeDetailsTitleProps) => {
  const classes = useStyles();
  const isHeaderLoading = loading && !pageType;

  if (isHeaderLoading) {
    return (
      <div className={classes.container}>
        <Skeleton __width="12em" data-test-id="page-type-details-title-skeleton" />
      </div>
    );
  }

  if (!pageType) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Box className={classes.name} title={pageType.name}>
        {pageType.name}
      </Box>
    </div>
  );
};
