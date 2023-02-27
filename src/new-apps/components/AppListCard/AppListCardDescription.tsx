import { GetV2SaleorAppsResponse } from '@dashboard/new-apps/marketplace.types';
import { Box, Text } from '@saleor/macaw-ui/next';
import React from 'react';

interface AppListCardDescriptionProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
}

const AppListCardDescription: React.FC<AppListCardDescriptionProps> = ({ app }) => (
  <Box marginBottom={6}>
    <Box display="flex" flexDirection="row" alignItems="center" marginBottom={8} gap={6}>
      <Box
        width={13}
        height={13}
        display="flex"
        placeItems="center"
        borderRadius={3}
        style={{
          backgroundColor: app.logo.color,
        }}
        data-test-id="app-logo"
      >
        {app.logo.source && <img src={app.logo.source} alt="App logo" />}
        {!app.logo.source && (
          <Text
            variant="bodyEmp"
            size="large"
            as="h2"
            data-test-id="app-logo-placeholder"
            color="textNeutralContrasted"
          >
            {app.name.en[0] || ''}
          </Text>
        )}
      </Box>
      <Text variant="bodyStrong" size="medium" color="textNeutralDefault">
        <strong>{app.name.en}</strong>
      </Text>
    </Box>
    <Text size="small" variant="body" color="textNeutralSubdued">
      {app.description.en}
    </Text>
  </Box>
);
AppListCardDescription.displayName = 'AppListCardDescription';
export default AppListCardDescription;
