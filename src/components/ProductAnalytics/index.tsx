import { PostHogConfig } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import React from "react";

const isDomainExcluded = () => {
  const domainsString = process.env.POSTHOG_EXCLUDED_DOMAINS;

  if (!domainsString) {
    return false;
  }

  const excludedDomains = domainsString.split(",");

  return excludedDomains.some(domain => window.location.hostname.includes(domain));
};

const useConfig = () => {
  const options = {
    api_host: process.env.POSTHOG_HOST,
    capture_pageview: false,
    autocapture: false,
    advanced_disable_decide: true,
    cookie_expiration: 30, // 30 days,
    loaded: posthog => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  } satisfies Partial<PostHogConfig>;
  const apiKey = process.env.POSTHOG_KEY;
  const isCloudInstance = process.env.IS_CLOUD_INSTANCE;

  const canRenderAnalytics = () => {
    if (!isCloudInstance) {
      return false;
    }

    if (isDomainExcluded()) {
      return false;
    }

    if (!options.api_host || !apiKey) {
      return false;
    }

    return true;
  };

  return {
    config: {
      options,
      apiKey,
    },
    canRenderAnalytics,
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
    <PostHogProvider apiKey={config.apiKey} options={config.options}>
      {children}
    </PostHogProvider>
  );
};
