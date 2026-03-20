import { extensionsResponseSchema } from "@dashboard/extensions/schema";
import { type APIExtensionsResponse, type ExtensionsGroups } from "@dashboard/extensions/types";
import { useEffect, useState } from "react";

const prepareExtensionsData = (data: APIExtensionsResponse): ExtensionsGroups => {
  return data.reduce<ExtensionsGroups>((acc, { name, extensions }) => {
    const group = name.en.toLowerCase();

    acc[group] = {
      title: name.en,
      items: extensions,
    };

    return acc;
  }, {});
};

const loadFallbackExtensions = async (): Promise<APIExtensionsResponse> => {
  const data = await import("@dashboard/extensions/data/extensions.json");
  const parsed = extensionsResponseSchema.parse(data.default ?? data);

  return parsed.extensionCategories;
};

const fetchApiExtensions = async (url: string): Promise<APIExtensionsResponse> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  const parsed = extensionsResponseSchema.parse(data);

  return parsed.extensionCategories;
};

export const useAppStoreExtensions = (appStoreUrl?: string) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExtensionsGroups>({});
  const isFallback = !appStoreUrl;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const categories = appStoreUrl
          ? await fetchApiExtensions(appStoreUrl)
          : await loadFallbackExtensions();

        setData(prepareExtensionsData(categories));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appStoreUrl]);

  return {
    error,
    loading,
    data,
    isFallback,
  };
};
