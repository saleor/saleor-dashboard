import { AppAvatar } from "@dashboard/extensions/components/AppAvatar/AppAvatar";
import useLocale from "@dashboard/hooks/useLocale";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

interface TaxAppLabelProps {
  name: string | null;
  logoUrl: string | undefined;
  created: string | null;
  id: string;
}

const formatDate = (locale: string, created: string): string => {
  const dateTimeString = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(created));

  return `(${dateTimeString})`;
};

export const TaxAppLabel = ({ name, logoUrl, created }: TaxAppLabelProps) => {
  const { locale } = useLocale();
  const logo = logoUrl ? { source: logoUrl } : undefined;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <AppAvatar logo={logo} size={4} />
      {name && (
        <Text>
          <FormattedMessage
            defaultMessage="Use app: {name}"
            id="W2OIhn"
            values={{
              name: (
                <Text size={4} fontWeight="bold">
                  {name}
                </Text>
              ),
            }}
          />
        </Text>
      )}
      {created && (
        <Text size={2} color="default2">
          {formatDate(locale, created)}
        </Text>
      )}
    </Box>
  );
};
