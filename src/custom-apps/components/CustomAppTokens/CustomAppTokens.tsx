// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { AppUpdateMutation } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface CustomAppTokensProps {
  tokens: AppUpdateMutation["appUpdate"]["app"]["tokens"] | null;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

const numberOfColumns = 3;
const CustomAppTokens: React.FC<CustomAppTokensProps> = props => {
  const { tokens, onCreate, onDelete } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title
        className={classes.cardTitle}
        toolbar={
          <Button variant="secondary" onClick={onCreate} data-test-id="create-token">
            <FormattedMessage id="RMB6fU" defaultMessage="Create Token" description="button" />
          </Button>
        }
      >
        {intl.formatMessage({
          id: "0Mg8o5",
          defaultMessage: "Tokens",
          description: "header",
        })}
      </DashboardCard.Title>

      <DashboardCard.Content>
        <ResponsiveTable>
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
          <TableBody>
            {renderCollection(
              tokens,
              token => (
                <TableRowLink key={token ? token.id : "skeleton"}>
                  <TableCell className={classes.colNote}>{token?.name || <Skeleton />}</TableCell>
                  <TableCell className={classes.colKey}>
                    {token?.authToken ? `**** ${token.authToken}` : <Skeleton />}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    <IconButton
                      variant="secondary"
                      color="primary"
                      onClick={() => onDelete(token.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
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
            )}
          </TableBody>
        </ResponsiveTable>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomAppTokens.displayName = "CustomAppTokens";
export default CustomAppTokens;
