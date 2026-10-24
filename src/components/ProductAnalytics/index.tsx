import { type PostHogConfig } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import type * as React from "react";

import { isProductAnalyticsEnabled } from "./config";
import { sanitizeAnalyticsUrl } from "./sanitizeAnalyticsUrl";

const urlPropertyNames = [
  "$current_url",
  "$pathname",
  "$referrer",
  "$session_entry_url",
  "$session_entry_pathname",
  "$session_referrer",
  "$session_pathname",
] as const;

interface UseConfig {
  config: {
    options: Partial<PostHogConfig>;
    apiKey: string | undefined;
  };
  canRenderAnalytics: () => boolean;
}

const useConfig = (): UseConfig => {
  const options: Partial<PostHogConfig> = {
    api_host: process.env.POSTHOG_HOST,
    capture_pageview: false,
    autocapture: false,
    advanced_only_evaluate_survey_feature_flags: true,
    cookie_expiration: 30, // 30 days,
    before_send: event => {
      if (!event) return null;

      for (const propertyName of urlPropertyNames) {
        const value = event.properties[propertyName];

        if (typeof value === "string") {
          event.properties[propertyName] = sanitizeAnalyticsUrl(value);
        }
      }

      return event;
    },
    loaded: posthog => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  };
  const apiKey = process.env.POSTHOG_KEY;

  return {
    config: {
      options,
      apiKey,
    },
    canRenderAnalytics: isProductAnalyticsEnabled,
  };
};

interface ProductAnalyticsProps {
  children: React.ReactNode;
}

export const ProductAnalytics = ({ children }: ProductAnalyticsProps) => {
  const { canRenderAnalytics, config } = useConfig();

  if (!canRenderAnalytics()) {
    return <>{children}</>;
  }

  return (
    // Note: Non-null assertion is fine here, it must be defined thanks to `canRenderAnalytics` check
    <PostHogProvider apiKey={config.apiKey!} options={config.options}>
      {children}
    </PostHogProvider>
  );
};
