import { IntlShape } from "react-intl";

import messages from "./messages";
import { SizePropertyEnum } from "./types";
import { mapSizePropertyToMessage } from "./utils";

export const variantsStaticColumnsAdapter = (intl: IntlShape, dimensions: string[]) => {
  const d = dimensions
    .filter(d => d in SizePropertyEnum)
    .map(dimension => ({
      id: dimension,
      title: mapSizePropertyToMessage(dimension as SizePropertyEnum, intl),
      width: 200,
      group: " ",
    }));

  return [
    {
      id: "size",
      title: intl.formatMessage(messages.size),
      width: 100,
      group: " ",
    },
    ...d,
  ];
};
