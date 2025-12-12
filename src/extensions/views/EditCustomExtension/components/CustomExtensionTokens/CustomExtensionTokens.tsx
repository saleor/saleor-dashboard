// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableButtonWrapper from "@dashboard/components/TableButtonWrapper";
import TableRowLink from "@dashboard/components/TableRowLink";
import { AppUpdateMutation } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface CustomAppTokensProps {
  tokens: AppUpdateMutation["appUpdate"]["app"]["tokens"] | null;
  onCreate: () => void;
  onDelete: (id: string) => void;
  hasManagedAppsPermission: boolean;
  isLoading: boolean;
}

const numberOfColumns = 3;

export const CustomExtensionTokens = (props: CustomAppTokensProps) => {
  const { tokens, onCreate, onDelete, hasManagedAppsPermission, isLoading } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const getTableBody = () => {
    if (!hasManagedAppsPermission) {
      return (
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
      );
    }

    if (isLoading) {
      return (
        <TableRowLink key={"skeleton"}>
          <TableCell className={classes.colNote}>
            <Skeleton />
          </TableCell>
          <TableCell className={classes.colKey}>
            <Skeleton />
          </TableCell>
          <TableCell className={classes.colActions}></TableCell>
        </TableRowLink>
      );
    }

    return renderCollection(
      tokens,
      token => (
        <TableRowLink key={token.id}>
          <TableCell className={classes.colNote}>
            {token.name || (
              <Box as="span" fontStyle="italic">
                <FormattedMessage
                  defaultMessage="(unknown)"
                  description="custom app tokens list - missing token name"
                  id="FmeBxD"
                />
              </Box>
            )}
          </TableCell>
          <TableCell className={classes.colKey}>{`**** ${token?.authToken}`}</TableCell>
          <TableCell className={classes.colActions}>
            {hasManagedAppsPermission && (
              <Box display="flex" justifyContent="flex-end" width="100%">
                <TableButtonWrapper>
                  <Button
                    variant="tertiary"
                    onClick={() => onDelete(token.id)}
                    data-test-id={`delete-token-${token.id}`}
                    icon={
                      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    }
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
    );
  };

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
          <TableBody>{getTableBody()}</TableBody>
        </ResponsiveTable>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomExtensionTokens.displayName = "CustomExtensionTokens";
