import React from "react";

import AppDetailsPage from "@saleor/apps/components/AppDetailsPage";

interface AppDetailsProps {
  id: string;
}

const fixture = [
  {
    id: "klaviyo",
    name: "Klaviyo",
    url: "http://localhost:9102"
  }
];

const AppDetails: React.FC<AppDetailsProps> = ({ id }) => {
  const app = fixture.find(a => a.id === id);

  return <AppDetailsPage app={app} />;
};

export default AppDetails;
