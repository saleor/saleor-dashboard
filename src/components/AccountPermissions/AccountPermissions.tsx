import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import { ShopInfo_shop_permissions } from "@saleor/components/Shop/types/ShopInfo";
import Skeleton from "@saleor/components/Skeleton";

const useStyles = makeStyles(
  theme => ({
    checkboxContainer: {
      marginTop: theme.spacing()
    },
    hr: {
      backgroundColor: theme.palette.divider,
      border: "none",
      height: 1,
      marginBottom: 0,
      marginTop: 0
    }
  }),
  { name: "AccountPermissions" }
);

interface AccountPermissionsProps {
  permissions: ShopInfo_shop_permissions[];
  data: {
    hasFullAccess: boolean;
    permissions: string[];
  };
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>, cb?: () => void) => void;
}

const AccountPermissions: React.FC<AccountPermissionsProps> = props => {
  const { data, disabled, permissions, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const handleFullAccessChange = (event: React.ChangeEvent<any>) =>
    onChange(event, () =>
      onChange({
        target: {
          name: "permissions",
          value: event.target.value ? permissions.map(perm => perm.code) : []
        }
      } as any)
    );
  const handlePermissionChange = (event: React.ChangeEvent<any>) => {
    onChange({
      target: {
        name: "permissions",
        value: event.target.value
          ? data.permissions.concat([event.target.name])
          : data.permissions.filter(perm => perm !== event.target.name)
      }
    } as any);
  };
  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Permissions",
          description: "dialog header"
        })}
      />
      <CardContent>
        <Typography>
          <FormattedMessage defaultMessage="Expand or restrict user's permissions to access certain part of saleor system." />
        </Typography>
        <div className={classes.checkboxContainer}>
          <ControlledCheckbox
            checked={data.hasFullAccess}
            disabled={disabled}
            label={intl.formatMessage({
              defaultMessage: "User has full access to the store",
              description: "checkbox label"
            })}
            name="hasFullAccess"
            onChange={handleFullAccessChange}
          />
        </div>
      </CardContent>
      {!data.hasFullAccess && (
        <>
          <hr className={classes.hr} />
          <CardContent>
            {permissions === undefined ? (
              <Skeleton />
            ) : (
              permissions.map(perm => (
                <div key={perm.code}>
                  <ControlledCheckbox
                    checked={
                      data.permissions.filter(
                        userPerm => userPerm === perm.code
                      ).length === 1
                    }
                    disabled={disabled}
                    label={perm.name.replace(/\./, "")}
                    name={perm.code}
                    onChange={handlePermissionChange}
                  />
                </div>
              ))
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

AccountPermissions.displayName = "AccountPermissions";
export default AccountPermissions;
