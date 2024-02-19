import { PostHogProvider } from "posthog-js/react";
import React from "react";

const useConfig = () => {
  const options = {
    api_host: process.env.POSTHOG_HOST,
  };
  const apiKey = process.env.POSTHOG_KEY;
  const isCloudInstance = process.env.IS_CLOUD_INSTANCE;
  const canRenderAnalytics = () => {
    if (!isCloudInstance) {
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
