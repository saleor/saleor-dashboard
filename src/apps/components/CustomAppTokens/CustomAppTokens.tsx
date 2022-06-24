import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { AppUpdateMutation } from "@saleor/graphql";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
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
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "0Mg8o5",
          defaultMessage: "Tokens",
          description: "header",
        })}
        toolbar={
          <Button
            variant="secondary"
            onClick={onCreate}
            data-test-id="create-token"
          >
            <FormattedMessage
              id="RMB6fU"
              defaultMessage="Create Token"
              description="button"
            />
          </Button>
        }
      />
      <ResponsiveTable>
        <TableHead>
          <TableRow>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            tokens,
            token => (
              <TableRow key={token ? token.id : "skeleton"}>
                <TableCell className={classes.colNote}>
                  {token?.name || <Skeleton />}
                </TableCell>
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
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="bsP4f3"
                    defaultMessage="No tokens found"
                  />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

CustomAppTokens.displayName = "CustomAppTokens";
export default CustomAppTokens;
