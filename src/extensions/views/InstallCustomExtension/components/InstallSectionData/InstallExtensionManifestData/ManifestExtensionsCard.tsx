import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Manifest } from "../../../types";
import styles from "./InstallExtensionManifestData.module.css";
import { manifestMessages } from "./messages";

export const ManifestExtensionsCard = ({ extensions }: { extensions: Manifest["extensions"] }) => {
  const intl = useIntl();

  return (
    <DetailSettingsCard
      title={intl.formatMessage(manifestMessages.extensions)}
      subtitle={intl.formatMessage(manifestMessages.extensionsSubtitle)}
      contentFlush
    >
      {extensions.map((extension, index) => (
        <Box key={`${extension.mountName}-${index}`} className={styles.row}>
          <Box display="flex" flexDirection="column">
            <Text size={3}>{extension.label}</Text>
            <Text size={2} color="default2">
              {extension.permissions.map(permission => permission.name).join(", ")}
            </Text>
          </Box>
          <Box className={styles.rowEnd}>
            <Text size={2} className={styles.mono}>
              {extension.mountName} · {extension.targetName}
            </Text>
            <Text size={2} color="default2" className={styles.mono}>
              {extension.url}
            </Text>
          </Box>
        </Box>
      ))}
    </DetailSettingsCard>
  );
};
