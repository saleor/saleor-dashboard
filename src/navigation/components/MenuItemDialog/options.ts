import { sectionNames } from "@dashboard/intl";
import { MenuItemType } from "@dashboard/navigation/components/MenuItemDialog";
import { IntlShape } from "react-intl";

export const getLinkTypeOptions = (intl: IntlShape) =>
  [
    {
      value: "category",
      label: intl.formatMessage(sectionNames.categories),
    },
    {
      value: "collection",
      label: intl.formatMessage(sectionNames.collections),
    },
    {
      value: "page",
      label: intl.formatMessage(sectionNames.pages),
    },
    {
      value: "link",
      label: intl.formatMessage({
        id: "H1L1cc",
        defaultMessage: "URL",
        description: "url",
      }),
    },
  ] satisfies Array<{ value: MenuItemType; label: string }>;
