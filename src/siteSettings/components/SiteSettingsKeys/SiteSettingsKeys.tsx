import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { authorizationKeyTypes, maybe, renderCollection } from "../../../misc";
import { ICONBUTTON_SIZE } from "../../../theme";
import { AuthorizationKeyType } from "../../../types/globalTypes";
import { SiteSettings_shop_authorizationKeys } from "../../types/SiteSettings";

const styles = (theme: Theme) =>
  createStyles({
    iconCell: {
      "&:last-child": {
        paddingRight: 0
      },
      width: ICONBUTTON_SIZE + theme.spacing.unit / 2
    }
  });

interface SiteSettingsKeysProps extends WithStyles<typeof styles> {
  disabled: boolean;
  keys: SiteSettings_shop_authorizationKeys[];
  onAdd: () => void;
  onRemove: (name: AuthorizationKeyType) => void;
}

const SiteSettingsKeys = withStyles(styles, { name: "SiteSettingsKeys" })(
  ({ classes, disabled, keys, onAdd, onRemove }: SiteSettingsKeysProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Authentication Keys",
            description: "section header"
          })}
          toolbar={
            <Button
              color="primary"
              disabled={disabled}
              variant="text"
              onClick={onAdd}
            >
              <FormattedMessage defaultMessage="Add key" description="button" />
            </Button>
          }
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Authentication Type"
                  description="authentication provider name"
                />
              </TableCell>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Key"
                  description="authentication provider API key"
                />
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(
              keys,
              key => (
                <TableRow
                  hover={!(disabled || !key)}
                  key={maybe(() => key.name)}
                >
                  <TableCell>
                    {maybe<React.ReactNode>(
                      () => authorizationKeyTypes[key.name],
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell>
                    {maybe<React.ReactNode>(() => key.key, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    <IconButton onClick={() => onRemove(key.name)}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
              () => (
                <TableRow>
                  <TableCell colSpan={3}>
                    <FormattedMessage
                      defaultMessage="No keys"
                      description="no authentication provider API keys"
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    );
  }
);
SiteSettingsKeys.displayName = "SiteSettingsKeys";
export default SiteSettingsKeys;
