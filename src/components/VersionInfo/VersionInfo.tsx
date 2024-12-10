import { Text } from "@saleor/macaw-ui-next";

import { useStyles } from "./styles";

interface VersionInfoProps {
  dashboardVersion: string;
  coreVersion: string;
}

const VersionInfo = ({ dashboardVersion, coreVersion }: VersionInfoProps) => {
  const classes = useStyles({});

  if (!dashboardVersion || !coreVersion) {
    return null;
  }

  return (
    <Text size={2} fontWeight="light" className={classes.container}>
      <div className={classes.versionItem}>{`dashboard ${dashboardVersion}`}</div>
      <div className={classes.versionItem}>{`core v${coreVersion}`}</div>
    </Text>
  );
};

VersionInfo.displayName = "VersionInfo";
export default VersionInfo;
