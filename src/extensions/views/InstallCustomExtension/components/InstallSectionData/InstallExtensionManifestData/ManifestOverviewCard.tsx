import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { ExternalLinkNext } from "@dashboard/components/ExternalLink/ExternalLink";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import { buttonMessages } from "@dashboard/intl";
import { Box, Chip, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { type Manifest } from "../../../types";
import styles from "./InstallExtensionManifestData.module.css";
import { manifestMessages } from "./messages";

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <Box className={styles.field}>
    <Text size={3} color="default2">
      {label}
    </Text>
    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={2} __minWidth="0">
      {children}
    </Box>
  </Box>
);

const MonoText = ({ text }: { text: string }) => (
  <Text size={3} className={styles.mono}>
    {text}
  </Text>
);

/** The value itself is the copy control; it turns green for a moment once copied. */
const CopyOnClick = ({ text }: { text: string }) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const label = intl.formatMessage(buttonMessages.copyToClipboard);

  return (
    <button
      type="button"
      className={styles.copyValue}
      title={label}
      aria-label={`${label}: ${text}`}
      onClick={() => copy(text)}
    >
      <Text size={3} color={copied ? "success1" : "default1"} className={styles.mono}>
        {text}
      </Text>
    </button>
  );
};

export const ManifestOverviewCard = ({
  manifest,
  manifestUrl,
}: {
  manifest: Manifest;
  manifestUrl: string;
}) => {
  const intl = useIntl();
  const links = [
    { url: manifest.homepageUrl, label: manifestMessages.homepage },
    { url: manifest.supportUrl, label: manifestMessages.support },
    { url: manifest.dataPrivacyUrl, label: manifestMessages.privacyPolicy },
  ].filter((link): link is typeof link & { url: string } => !!link.url);

  return (
    <DetailSettingsCard title={intl.formatMessage(manifestMessages.overview)}>
      <Box display="flex" flexDirection="column" gap={2}>
        {manifest.about && (
          <Text size={3} color="default2">
            {manifest.about}
          </Text>
        )}
        <Box>
          <Field label={intl.formatMessage(manifestMessages.identifier)}>
            <CopyOnClick text={manifest.identifier} />
          </Field>
          <Field label={intl.formatMessage(manifestMessages.manifestUrl)}>
            <CopyOnClick text={manifestUrl} />
          </Field>
          {manifest.requiredSaleorVersion && (
            <Field label={intl.formatMessage(manifestMessages.requiredSaleorVersion)}>
              <MonoText text={manifest.requiredSaleorVersion.constraint} />
              {!manifest.requiredSaleorVersion.satisfied && (
                <Chip backgroundColor="critical1" borderColor="critical1" color="critical1">
                  {intl.formatMessage(manifestMessages.versionNotSupported)}
                </Chip>
              )}
            </Field>
          )}
          {links.length > 0 && (
            <Field label={intl.formatMessage(manifestMessages.links)}>
              {links.map(link => (
                <ExternalLinkNext key={link.url} href={link.url} target="_blank" color="accent1">
                  {intl.formatMessage(link.label)}
                </ExternalLinkNext>
              ))}
            </Field>
          )}
        </Box>
      </Box>
    </DetailSettingsCard>
  );
};
