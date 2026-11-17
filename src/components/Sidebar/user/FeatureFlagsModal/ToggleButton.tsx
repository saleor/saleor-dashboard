import { type Name } from "@dashboard/featureFlags/availableFlags";
import { Button, Spinner } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { usePersistence } from "./usePersistence";

interface ToggleButtonProps {
  isEnabled: boolean;
  flagSlug: Name;
}

export const ToggleButton = ({ isEnabled, flagSlug }: ToggleButtonProps) => {
  const intl = useIntl();
  const { toggleFlag } = usePersistence();
  const [loading, setLoading] = useState(false);
  const handleToggleClick = async () => {
    setLoading(true);
    await toggleFlag(flagSlug);
    window.location.reload();
  };

  if (loading) {
    return (
      <Button variant="secondary" size="small" disabled>
        <Spinner />{" "}
        {isEnabled
          ? intl.formatMessage({ id: "WpKh6Y", defaultMessage: "Disabling" })
          : intl.formatMessage({ id: "Dm0+LS", defaultMessage: "Enabling" })}
      </Button>
    );
  }

  return (
    <Button variant="secondary" size="small" onClick={handleToggleClick}>
      {isEnabled
        ? intl.formatMessage({ id: "Rw7iI7", defaultMessage: "Disable" })
        : intl.formatMessage({ id: "TqSTI0", defaultMessage: "Enable" })}
    </Button>
  );
};
