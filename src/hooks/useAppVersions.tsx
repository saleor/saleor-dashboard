import { useEffect, useState } from "react";

import packageJson from "../../package.json";

const CORE_PACKAGE_URL =
  "https://raw.githubusercontent.com/mirumee/saleor/master/package.json";

export const useAppVersions = () => {
  const [coreVersion, setCoreVersion] = useState<string | null>(null);

  const dashboardVersion: string = packageJson.version;

  const getCoreVersion = async url => {
    try {
      const response = await fetch(url);
      const { version } = await response.json();
      setCoreVersion(version);
    } catch (e) {
      setCoreVersion("core version not found");
    }
  };

  useEffect(() => {
    getCoreVersion(CORE_PACKAGE_URL);
  }, []);

  return {
    dashboardVersion,
    coreVersion
  };
};
