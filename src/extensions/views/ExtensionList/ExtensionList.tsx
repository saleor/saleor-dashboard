import React from "react";

import ExtensionListPage from "@saleor/extensions/components/ExtensionListPage";
import { extensions } from "@saleor/extensions/fixtures";
import useNavigator from "@saleor/hooks/useNavigator";
import {
  extensiontUrl,
  ExtensionListUrlQueryParams
} from "@saleor/extensions/urls";
import { pageListProps } from "@saleor/fixtures";

interface ExtensionListProps {
  params: ExtensionListUrlQueryParams;
}

const ExtensionList: React.FC<ExtensionListProps> = () => {
  const navigate = useNavigator();

  return (
    <ExtensionListPage
      {...pageListProps.default}
      extensions={extensions}
      onMarketplaceClick={() => undefined}
      onRowClick={id => () => navigate(extensiontUrl(id))}
    />
  );
};

export default ExtensionList;
