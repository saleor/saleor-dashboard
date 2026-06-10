import { TranslationsIcon } from "@dashboard/icons/Translations";
import { Button, type ButtonProps } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { translationsButtonMessages } from "./messages";

export const TranslationsButton = ({ title, ...props }: ButtonProps) => {
  const intl = useIntl();

  return (
    <Button
      variant="secondary"
      icon={<TranslationsIcon />}
      title={title ?? intl.formatMessage(translationsButtonMessages.openTranslations)}
      {...props}
    />
  );
};
