import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
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
          <Button color="primary" onClick={onCreate}>
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
