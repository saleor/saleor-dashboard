import React from "react";

import ExtensionListPage from "@saleor/extensions/components/ExtensionListPage";
import { extensions } from "@saleor/extensions/fixtures";
import useNavigator from "@saleor/hooks/useNavigator";
import { extensiontUrl } from "@saleor/extensions/urls";

interface ExtensionListProps {}

const ExtensionList: React.FC<ExtensionListProps> = () => {
  const navigate = useNavigator();

  return (
    <ExtensionListPage
      extensions={extensions}
      onMarketplaceClick={() => undefined}
      onRowClick={id => () => navigate(extensiontUrl(id))}
    />
  );
};

export default ExtensionList;
