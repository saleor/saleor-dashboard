import { ClickableModelType } from "@dashboard/components/ModelType/ModelType";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

interface PageDetailsHeaderPage {
  title: string;
  pageType?: {
    id?: string;
    name?: string;
  } | null;
}

interface PageDetailsTitleProps {
  page?: PageDetailsHeaderPage | null;
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
  { name: "PageDetailsTitle" },
);

export const PageDetailsTitle = ({ page, loading }: PageDetailsTitleProps) => {
  const classes = useStyles();

  const isHeaderLoading = loading && !page;

  if (isHeaderLoading) {
    return (
      <div className={classes.container}>
        <Skeleton __width="12em" data-test-id="page-details-title-skeleton" />
        <Skeleton __width="6rem" data-test-id="page-details-model-type-skeleton" />
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Box className={classes.name} title={page.title}>
        {page.title}
      </Box>
      {page.pageType?.name && (
        <ClickableModelType
          modelType={{
            id: page.pageType.id,
            name: page.pageType.name,
          }}
          size={3}
        />
      )}
    </div>
  );
};
