import { AppPermissionFragment } from '@dashboard/graphql';
import { Tooltip } from '@saleor/macaw-ui';
import { Box, InfoIcon } from '@saleor/macaw-ui/next';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { messages } from './messages';
import { useStyles } from './styles';

interface AppPermissionsProps {
  permissions?: AppPermissionFragment[] | null;
}

export const AppPermissions: React.FC<AppPermissionsProps> = ({ permissions }) => {
  const classes = useStyles();

  return (
    <Tooltip
      header={<FormattedMessage {...messages.appPermissions} />}
      title={
        <ul className={classes.list}>
          {permissions?.length ? (
            permissions?.map(permission => <li key={permission.code}>{permission.name}</li>)
          ) : (
            <li>
              <FormattedMessage {...messages.noPermissions} />
            </li>
          )}
        </ul>
      }
    >
      <Box display="flex" placeItems="center">
        <InfoIcon color="iconNeutralSubdued" size="large" />
      </Box>
    </Tooltip>
  );
};
AppPermissions.displayName = 'AppPermissions';
export default AppPermissions;
