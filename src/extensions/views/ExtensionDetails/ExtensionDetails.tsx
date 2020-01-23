import React from "react";

import ExtensionDetailsPage from "@saleor/extensions/components/ExtensionDetailsPage";

interface ExtensionDetailsProps {
  id: string;
}

const fixture = [
  {
    id: "klaviyo",
    name: "Klaviyo",
    url: "http://localhost:9102"
  }
];

const ExtensionDetails: React.FC<ExtensionDetailsProps> = ({ id }) => {
  const app = fixture.find(a => a.id === id);

  return <ExtensionDetailsPage app={app} />;
};

export default ExtensionDetails;
