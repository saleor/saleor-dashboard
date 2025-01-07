import { useUser } from "@dashboard/auth";
import useShop from "@dashboard/hooks/useShop";
import { usePostHog } from "posthog-js/react";

import { extractEmailDomain } from "./utils";

interface Analytics {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
}

export function useAnalytics(): Analytics {
  const posthog = usePostHog();
  const { user } = useUser();
  const shop = useShop();

  function trackEvent(event: string, properties?: Record<string, any>) {
    if (!posthog) return;

    posthog.capture(event, {
      $set: {
        domain: shop?.domain?.host,
        email_domain: extractEmailDomain(user?.email ?? ""),
      },
      ...properties,
    });
  }

  return { trackEvent };
}
