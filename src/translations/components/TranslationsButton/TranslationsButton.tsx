import { TranslationsIcon } from "@dashboard/icons/Translations";
import { Button, ButtonProps } from "@saleor/macaw-ui-next";

export const TranslationsButton = (props: ButtonProps) => {
  return <Button variant="secondary" icon={<TranslationsIcon />} {...props} />;
};
