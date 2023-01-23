import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import Container from "@dashboard/components/Container";
import PageHeader from "@dashboard/components/PageHeader";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import { AppListItemFragment } from "@dashboard/graphql";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { renderCollection } from "@dashboard/misc";
import { Card, TableBody, TableCell, Typography } from "@material-ui/core";
import { DeleteIcon, IconButton, ResponsiveTable } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppsSkeleton from "../../../apps/components/AppsSkeleton";
import DeactivatedText from "../../../apps/components/DeactivatedText";
import { useStyles } from "../../../apps/styles";

export interface CustomAppListPageProps {
  appsList: AppListItemFragment[];
  getCustomAppHref: (id: string) => string;
  onRemove: (id: string) => void;
}

const CustomAppListPage: React.FC<CustomAppListPageProps> = ({
  appsList,
  onRemove,
  getCustomAppHref,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.webhooksAndEvents)} />
      <p>
        <FormattedMessage
          defaultMessage="Local apps are custom webhooks & token pairs that can be used to
            connect apps and access Saleor API."
          id="L/sNGY"
        />
      </p>
      <Card className={classes.customApps}>
        <CardTitle
          toolbar={
            <Button
              variant="secondary"
              href={CustomAppUrls.appAddUrl}
              data-test-id="create-app"
            >
              <FormattedMessage
                id="XB2Jj9"
                defaultMessage="Create App"
                description="create app button"
              />
            </Button>
          }
          title={intl.formatMessage(commonMessages.customApps)}
        />
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
                          <DeleteIcon />
                        </IconButton>
                      </TableButtonWrapper>
                    </TableCell>
                  </TableRowLink>
                ) : (
                  <AppsSkeleton key={index} />
                ),
              () => (
                <TableRowLink className={classes.tableRow}>
                  <TableCell className={classes.colName}>
                    <Typography className={classes.text} variant="body2">
                      <FormattedMessage
                        id="voRaz3"
                        defaultMessage="Your custom-created apps will be shown here."
                        description="custom apps content"
                      />
                    </Typography>
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </TableBody>
        </ResponsiveTable>
      </Card>
    </Container>
  );
};

CustomAppListPage.displayName = "CustomAppListPage";
export default CustomAppListPage;
