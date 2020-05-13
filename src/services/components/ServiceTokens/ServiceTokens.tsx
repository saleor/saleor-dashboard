import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { maybe, renderCollection } from "@saleor/misc";
import { ServiceDetailsFragment_tokens } from "@saleor/services/types/ServiceDetailsFragment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ServiceTokensProps {
  tokens: ServiceDetailsFragment_tokens[];
  onCreate: () => void;
  onDelete: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.down("md")]: {
      colNote: {
        width: 200
      }
    },
    colActions: {
      textAlign: "right",
      width: 100
    },
    colKey: {
      width: 200
    },
    colNote: {},
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "ServiceTokens" }
);

const numberOfColumns = 3;

const ServiceTokens: React.FC<ServiceTokensProps> = props => {
  const { tokens, onCreate, onDelete } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Service Account Information",
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
                description="service account key"
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
                  {maybe<React.ReactNode>(() => token.name, <Skeleton />)}
                </TableCell>
                <TableCell className={classes.colKey}>
                  {maybe<React.ReactNode>(
                    () => `**** ${token.authToken}`,
                    <Skeleton />
                  )}
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

ServiceTokens.displayName = "ServiceTokens";
export default ServiceTokens;
