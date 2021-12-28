import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { Button, DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AppUpdate_appUpdate_app_tokens } from "../../types/AppUpdate";
import { useStyles } from "./styles";

export interface CustomAppTokensProps {
  tokens: Array<AppUpdate_appUpdate_app_tokens | null> | null;
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
          defaultMessage: "Tokens",
          description: "header"
        })}
        toolbar={
          <Button
            variant="secondary"
            onClick={onCreate}
            data-test-id="createToken"
          >
            <FormattedMessage
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
              <FormattedMessage defaultMessage="Token Note" />
            </TableCell>
            <TableCell className={classes.colKey}>
              <FormattedMessage
                defaultMessage="Key"
                description="custom app token key"
              />
            </TableCell>
            <TableCell className={classes.colActions}>
              <FormattedMessage
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
                  <FormattedMessage defaultMessage="No tokens found" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

CustomAppTokens.displayName = "CustomAppTokens";
export default CustomAppTokens;
