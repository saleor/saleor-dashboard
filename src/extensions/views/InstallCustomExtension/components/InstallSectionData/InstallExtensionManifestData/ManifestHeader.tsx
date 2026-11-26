import { AppAvatar } from "@dashboard/extensions/components/AppAvatar/AppAvatar";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Manifest } from "../../../types";
import styles from "./InstallExtensionManifestData.module.css";
import { manifestMessages } from "./messages";
import { TrustChip } from "./TrustChip";

export const ManifestHeader = ({
  manifest,
  manifestHost,
  isOfficial,
}: {
  manifest: Manifest;
  manifestHost: string;
  isOfficial: boolean;
}) => {
  const intl = useIntl();
  const details = [
    intl.formatMessage(manifestMessages.headerVersion, { version: manifest.version }),
    manifest.author &&
      intl.formatMessage(manifestMessages.headerAuthor, { author: manifest.author }),
  ].filter(Boolean);

  return (
    <Box className={styles.header} data-test-id="install-manifest-header">
      <AppAvatar
        size={12}
        logo={manifest.brand?.logo.default ? { source: manifest.brand.logo.default } : undefined}
      />
      <Box display="flex" flexDirection="column" gap={1} __minWidth="0">
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Text size={6} fontWeight="bold">
            {manifest.name}
          </Text>
          <TrustChip isOfficial={isOfficial} />
        </Box>
        <Text size={3} color="default2">
          {details.join(" · ")} ·{" "}
          <Text as="span" size={3} className={styles.mono}>
            {manifestHost}
          </Text>
        </Text>
      </Box>
    </Box>
  );
};
