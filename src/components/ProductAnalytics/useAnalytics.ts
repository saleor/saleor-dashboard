import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { usePostHog } from "posthog-js/react";

interface UserProperties {
  domain: string;
  email_domain: string;
}

interface Analytics {
  initialize: (userProperties: UserProperties) => void;
  trackEvent: (event: string, properties?: Record<string, any>) => void;
}

export function useAnalytics(): Analytics {
  const posthog = usePostHog();
  const [lastUserProperties, setLastUserProperties] = useLocalStorage<UserProperties>(
    "analyticsUserProperties",
    {
      domain: "",
      email_domain: "",
    },
  );

  function initialize(userProperties: UserProperties) {
    if (!posthog) return;

    if (!hasUserPropertiesChanged(userProperties, lastUserProperties)) return;

    const id = posthog.get_distinct_id();

    posthog.identify(id, userProperties);

    setLastUserProperties(userProperties);
  }

  function trackEvent(event: string, properties?: Record<string, any>) {
    if (!posthog) return;

    posthog.capture(event, properties);
  }

  return { trackEvent, initialize };
}

function hasUserPropertiesChanged(
  userProperties: UserProperties,
  lastInitializedUserProperties: UserProperties,
) {
  return (
    userProperties.domain !== lastInitializedUserProperties.domain ||
    userProperties.email_domain !== lastInitializedUserProperties.email_domain
  );
}
