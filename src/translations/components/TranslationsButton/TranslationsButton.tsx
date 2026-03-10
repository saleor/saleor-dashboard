import { TranslationsIcon } from "@dashboard/icons/Translations";
import { Button, type ButtonProps } from "@macaw-ui";

export const TranslationsButton = (props: ButtonProps) => {
  return <Button variant="secondary" icon={<TranslationsIcon />} {...props} />;
};
