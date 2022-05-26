import { AppPermissionFragment } from "@saleor/graphql";
import {
  IconButton,
  makeStyles,
  PermissionsIcon,
  Tooltip,
} from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  () => ({
    list: {
      margin: 0,
      paddingLeft: "16px",
    },
  }),
  { name: "AppPermissions" },
);

interface AppPermissionsProps {
  permissions: AppPermissionFragment[];
}

export const AppPermissions = ({ permissions }: AppPermissionsProps) => {
  const classes = useStyles();
  return (
    <Tooltip
      header={
        <FormattedMessage
          defaultMessage="App permissions"
          id="xNfh4L"
          description="app permissions tooltip header"
        />
      }
      title={
        <ul className={classes.list}>
          {permissions.map(permission => (
            <li key={permission.code}>{permission.name}</li>
          ))}
        </ul>
      }
    >
      <IconButton variant="secondary" color="primary">
        <PermissionsIcon />
      </IconButton>
    </Tooltip>
  );
};
