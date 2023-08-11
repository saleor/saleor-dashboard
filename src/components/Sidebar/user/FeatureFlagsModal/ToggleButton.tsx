import { Button, Spinner } from "@saleor/macaw-ui/next";
import React, { useState } from "react";

import { usePersistance } from "./usePersistance";

interface ToggleButtonProps {
  isEnabled: boolean;
  flagSlug: string;
}

export const ToggleButton = ({ isEnabled, flagSlug }: ToggleButtonProps) => {
  const { toggleFlag } = usePersistance();
  const [loading, setLoading] = useState(false);

  const handleToggleClick = async () => {
    setLoading(true);
    await toggleFlag(flagSlug);

    window.location.reload();
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
