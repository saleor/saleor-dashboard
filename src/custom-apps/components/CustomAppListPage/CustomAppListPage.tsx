import DeactivatedText from "@dashboard/apps/components/DeactivatedText";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableRowLink from "@dashboard/components/TableRowLink";
import { configurationMenuUrl } from "@dashboard/configuration";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import { AppListItemFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { renderCollection } from "@dashboard/misc";
import { TableBody, TableCell } from "@material-ui/core";
import { DeleteIcon, IconButton, ResponsiveTable } from "@saleor/macaw-ui";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import CustomAppsSkeleton from "../CustomAppsSkeleton";
import { useStyles } from "./styles";

export interface CustomAppListPageProps {
  appsList: AppListItemFragment[];
  getCustomAppHref: (id: string) => string;
  onRemove: (id: string) => void;
}

const CustomAppListPage = ({ appsList, onRemove, getCustomAppHref }: CustomAppListPageProps) => {
  const intl = useIntl();
  const classes = useStyles();
  const navigate = useNavigator();

  return (
    <ListPageLayout>
      <TopNav
        title={intl.formatMessage(sectionNames.webhooksAndEvents)}
        href={configurationMenuUrl}
      >
        <Button
          variant="primary"
          onClick={() => navigate(CustomAppUrls.appAddUrl)}
          data-test-id="create-app"
        >
          <FormattedMessage
            id="XB2Jj9"
            defaultMessage="Create App"
            description="create app button"
          />
        </Button>
      </TopNav>
      <Box padding={6}>
        <Box marginBottom={1.5}>
          <Text as="p">
            <FormattedMessage
              defaultMessage="Local apps are custom webhooks & token pairs that can be used to
            connect apps and access Saleor API."
              id="L/sNGY"
            />
          </Text>
        </Box>

        <ResponsiveTable>
          <TableBody>
            {renderCollection(
              appsList,
              (app, index) =>
                app ? (
                  <TableRowLink
                    key={app.id}
                    className={classes.tableRow}
                    href={getCustomAppHref(app.id)}
                  >
                    <TableCell className={classes.colName}>
                      <span data-tc="name" className={classes.appName}>
                        {app.name}
                      </span>
                      {!app.isActive && (
                        <div className={classes.statusWrapper}>
                          <DeactivatedText />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={classes.colAction}>
                      <TableButtonWrapper>
                        <IconButton
                          variant="secondary"
                          color="primary"
                          onClick={() => onRemove(app.id)}
                        >
                          <DeleteIcon
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        </IconButton>
                      </TableButtonWrapper>
                    </TableCell>
                  </TableRowLink>
                ) : (
                  <CustomAppsSkeleton key={index} />
                ),
              () => (
                <TableRowLink className={classes.tableRow}>
                  <TableCell className={classes.colName}>
                    <Text className={classes.text} fontSize={3}>
                      <FormattedMessage
                        id="voRaz3"
                        defaultMessage="Your custom-created apps will be shown here."
                        description="custom apps content"
                      />
                    </Text>
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </TableBody>
        </ResponsiveTable>
      </Box>
    </ListPageLayout>
  );
};

CustomAppListPage.displayName = "CustomAppListPage";
export default CustomAppListPage;
