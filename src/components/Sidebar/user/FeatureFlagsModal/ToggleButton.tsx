import { Name } from "@dashboard/featureFlags/availableFlags";
import { Button, Spinner } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";

import { usePersistence } from "./usePersistence";

interface ToggleButtonProps {
  isEnabled: boolean;
  flagSlug: Name;
}

export const ToggleButton = ({ isEnabled, flagSlug }: ToggleButtonProps) => {
  const { toggleFlag } = usePersistence();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const history = useHistory();
  const currentRoute = location.pathname;

  const handleToggleClick = async () => {
    setLoading(true);
    await toggleFlag(flagSlug);

    history.replace(currentRoute);
  };

  if (loading) {
    return (
      <Button variant="secondary" size="small" disabled>
        <Spinner /> {isEnabled ? "Disabling" : "Enabling"}
      </Button>
    );
  }

  return (
    <Button variant="secondary" size="small" onClick={handleToggleClick}>
      {isEnabled ? "Disable" : "Enable"}
    </Button>
  );
};
