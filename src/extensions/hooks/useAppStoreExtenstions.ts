import { APIExtensionsResponse, ExtensionsGroups } from "@dashboard/extensions/types";
import { useEffect, useState } from "react";

const prepareExtensionsData = (data: APIExtensionsResponse) => {
  return data.reduce((acc, { name, extensions }) => {
    const group = name.en.toLowerCase() as keyof ExtensionsGroups;

    acc[group] = {
      title: name.en,
      items: extensions,
    };

    return acc;
  }, {} as ExtensionsGroups);
};

export const useAppStoreExtensions = (appStoreUrl: string) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtensionsGroups>({
    payments: {
      items: [],
      title: "",
    },
    cms: { items: [], title: "" },
    taxes: {
      items: [],
      title: "",
    },
    automation: {
      items: [],
      title: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(appStoreUrl);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();

        setData(prepareExtensionsData(data.extensionCategories));
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
  };
};
