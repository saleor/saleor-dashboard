import React from "react";

import { Button, ButtonProps } from "@saleor/macaw-ui-next";

import { TranslationsIcon } from "@dashboard/icons/Translations";

export const TranslationsButton = (props: ButtonProps) => {
  return <Button variant="secondary" icon={<TranslationsIcon />} {...props} />;
};
