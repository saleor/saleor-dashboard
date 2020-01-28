import React from "react";

import ExtensionDetailsPage from "@saleor/extensions/components/ExtensionDetailsPage";
import { extensions } from "@saleor/extensions/fixtures";
import useNavigator from "@saleor/hooks/useNavigator";
import { extensionListUrl } from "@saleor/extensions/urls";

interface ExtensionDetailsProps {
  id: string;
}

const ExtensionDetails: React.FC<ExtensionDetailsProps> = ({ id }) => {
  const navigate = useNavigator();
  const app = extensions.find(a => a.id === id);

  return (
    <ExtensionDetailsPage
      app={app}
      onBack={() => navigate(extensionListUrl())}
    />
  );
};

export default ExtensionDetails;
