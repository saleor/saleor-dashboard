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
  const [hasBeenUserSet, setHasBeenUserSet] = useLocalStorage<boolean>(
    "analyticsHasBeenUserSet",
    false,
  );

  function initialize(userProperties: UserProperties) {
    if (!posthog) return;

    // initialize function is called on each reload that cause generates new used id by identify function
    // to avoid this we need to check if user has been set
    if (hasBeenUserSet) return;

    const id = posthog.get_distinct_id();

    posthog.identify(id, userProperties);

    setHasBeenUserSet(true);
  }

  function trackEvent(event: string, properties?: Record<string, any>) {
    if (!posthog) return;

    posthog.capture(event, properties);
  }

  return { trackEvent, initialize };
}
