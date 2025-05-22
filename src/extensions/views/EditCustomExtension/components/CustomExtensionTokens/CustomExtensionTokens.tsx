// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableButtonWrapper from "@dashboard/components/TableButtonWrapper";
import TableRowLink from "@dashboard/components/TableRowLink";
import { AppUpdateMutation } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Skeleton, Text, TrashBinIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface CustomAppTokensProps {
  tokens: AppUpdateMutation["appUpdate"]["app"]["tokens"] | null;
  onCreate: () => void;
  onDelete: (id: string) => void;
  hasManagedAppsPermission: boolean;
}

const numberOfColumns = 3;

const CustomExtensionTokens: React.FC<CustomAppTokensProps> = props => {
  const { tokens, onCreate, onDelete, hasManagedAppsPermission } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "0Mg8o5",
            defaultMessage: "Tokens",
            description: "header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          {hasManagedAppsPermission && (
            <Button variant="secondary" onClick={onCreate} data-test-id="create-token">
              <FormattedMessage id="RMB6fU" defaultMessage="Create Token" description="button" />
            </Button>
          )}
        </DashboardCard.Toolbar>
      </DashboardCard.Header>

      <DashboardCard.Content paddingX={0}>
        <ResponsiveTable>
          {hasManagedAppsPermission && (
            <TableHead>
              <TableRowLink>
                <TableCell className={classes.colNote}>
                  <FormattedMessage id="0DRBjg" defaultMessage="Token Note" />
                </TableCell>
                <TableCell className={classes.colKey}>
                  <FormattedMessage
                    id="MAsLIT"
                    defaultMessage="Key"
                    description="custom app token key"
                  />
                </TableCell>
                <TableCell className={classes.colActions}>
                  <FormattedMessage
                    id="VHuzgq"
                    defaultMessage="Actions"
                    description="table actions"
                  />
                </TableCell>
              </TableRowLink>
            </TableHead>
          )}
          <TableBody>
            {hasManagedAppsPermission ? (
              renderCollection(
                tokens,
                token => (
                  <TableRowLink key={token ? token.id : "skeleton"}>
                    <TableCell className={classes.colNote}>{token?.name || <Skeleton />}</TableCell>
                    <TableCell className={classes.colKey}>
                      {token?.authToken ? `**** ${token.authToken}` : <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colActions}>
                      {hasManagedAppsPermission && (
                        <Box display="flex" justifyContent="flex-end" width="100%">
                          <TableButtonWrapper>
                            <Button
                              variant="tertiary"
                              onClick={() => onDelete(token.id)}
                              data-test-id={`delete-token-${token.id}`}
                              icon={<TrashBinIcon />}
                            />
                          </TableButtonWrapper>
                        </Box>
                      )}
                    </TableCell>
                  </TableRowLink>
                ),
                () => (
                  <TableRowLink>
                    <TableCell colSpan={numberOfColumns}>
                      <FormattedMessage id="bsP4f3" defaultMessage="No tokens found" />
                    </TableCell>
                  </TableRowLink>
                ),
              )
            ) : (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <Text color="default2">
                    <FormattedMessage
                      id="m2Jb3P"
                      defaultMessage="You don't have permission to manage authentication tokens. Contact your administrator for access."
                    />
                  </Text>
                </TableCell>
              </TableRowLink>
            )}
          </TableBody>
        </ResponsiveTable>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomExtensionTokens.displayName = "CustomAppTokens";
export default CustomExtensionTokens;
