import { type EntityBackgroundImageFieldMessages } from "@dashboard/components/EntityBackgroundImageField/types";
import { defineMessages } from "react-intl";

export const collectionBackgroundImageMessages: EntityBackgroundImageFieldMessages = defineMessages(
  {
    hint: {
      id: "qfEVRX",
      defaultMessage:
        "Shown on collection pages if your storefront uses it. Use a wide image; add alt text for accessibility.",
      description: "collection background image helper text below upload area",
    },
    imageAlt: {
      id: "ZJHgVh",
      defaultMessage: "Image alt text",
      description: "collection background image alt text field label",
    },
    imageAltHelper: {
      id: "FpcXEj",
      defaultMessage:
        'Describe the image for screen readers, e.g. "Summer sale banner with beach scene."',
      description: "collection background image alt text field helper",
    },
  },
);
