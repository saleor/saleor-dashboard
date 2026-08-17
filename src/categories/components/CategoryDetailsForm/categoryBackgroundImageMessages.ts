import { type EntityBackgroundImageFieldMessages } from "@dashboard/components/EntityBackgroundImageField/types";
import { defineMessages } from "react-intl";

export const categoryBackgroundImageMessages: EntityBackgroundImageFieldMessages = defineMessages({
  hint: {
    id: "YD0ckk",
    defaultMessage:
      "Shown on category pages if your storefront uses it. Use a wide image; add alt text for accessibility.",
    description: "category background image helper text below upload area",
  },
  imageAlt: {
    id: "STgcIO",
    defaultMessage: "Image alt text",
    description: "category background image alt text field label",
  },
  imageAltHelper: {
    id: "cbuyLA",
    defaultMessage:
      'Describe the image for screen readers, e.g. "Summer sale banner with beach scene."',
    description: "category background image alt text field helper",
  },
});
