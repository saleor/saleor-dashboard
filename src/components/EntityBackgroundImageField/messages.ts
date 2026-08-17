import { defineMessages } from "react-intl";

import { type EntityBackgroundImageFieldMessages } from "./types";

export const entityBackgroundImageFieldMessages: EntityBackgroundImageFieldMessages =
  defineMessages({
    hint: {
      id: "YgZVI1",
      defaultMessage:
        "Shown on storefront pages if your theme uses it. Use a wide image; add alt text for accessibility.",
      description: "entity background image helper text below upload area",
    },
    imageAlt: {
      id: "GTuhwY",
      defaultMessage: "Image alt text",
      description: "entity background image alt text field label",
    },
    imageAltHelper: {
      id: "TSHyul",
      defaultMessage:
        'Describe the image for screen readers, e.g. "Summer sale banner with beach scene."',
      description: "entity background image alt text field helper",
    },
  });
