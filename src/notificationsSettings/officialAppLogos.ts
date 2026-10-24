import {
  CUSTOMER_EMAILS_APP_IDENTIFIER,
  SMTP_APP_IDENTIFIER,
} from "@dashboard/notificationsSettings/constants";

/** Hosted App Store marks — same files Explore and apps.saleor.io use. */
const officialAppLogos: Record<string, { light: string; dark: string }> = {
  [CUSTOMER_EMAILS_APP_IDENTIFIER]: {
    light: "https://apps.saleor.io/apps/v2/saleor-apps/customer-emails.png",
    dark: "https://apps.saleor.io/apps/v2/saleor-apps/customer-emails.png",
  },
  [SMTP_APP_IDENTIFIER]: {
    light: "https://apps.saleor.io/apps/v2/smtp.svg",
    dark: "https://apps.saleor.io/apps/v3/app-smtp-dark.svg",
  },
};

export const getOfficialAppLogoSource = (identifier: string, theme: string): string | undefined => {
  const logo = officialAppLogos[identifier];

  if (!logo) {
    return undefined;
  }

  return theme === "defaultDark" ? logo.dark : logo.light;
};
