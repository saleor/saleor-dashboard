import { pathNames, sectionNames } from "@saleor/intl";
import { MessageDescriptor } from "react-intl";

const getSectionPaths = (url: string) => url.split("/").filter(el => !!el);

export const getPreviousPathName = ({
  previousPage,
  defaultName
}: {
  defaultName: MessageDescriptor;
  previousPage?: string;
}) => {
  if (previousPage) {
    const path = getSectionPaths(previousPage);

    switch (path[0]) {
      case "product-types":
        if (path.length > 0) {
          return pathNames.productType;
        }
        return sectionNames.productTypes;
    }
  }

  return defaultName;
};
