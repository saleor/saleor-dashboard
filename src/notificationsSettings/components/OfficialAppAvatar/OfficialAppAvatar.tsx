import { AppAvatar } from "@dashboard/extensions/components/AppAvatar/AppAvatar";
import { getOfficialAppLogoSource } from "@dashboard/notificationsSettings/officialAppLogos";
import { useTheme } from "@saleor/macaw-ui-next";

interface OfficialAppAvatarProps {
  identifier: string;
}

export const OfficialAppAvatar = ({ identifier }: OfficialAppAvatarProps): React.ReactNode => {
  const { theme } = useTheme();
  const source = getOfficialAppLogoSource(identifier, theme);

  return <AppAvatar logo={source ? { source } : undefined} size={8} />;
};
