import React from "react";

import styles from "./styles";

interface AppVersionsProps {
  dashboardVersion: string;
  coreVersion: string;
}

const AppVersions: React.FC<AppVersionsProps> = ({
  dashboardVersion,
  coreVersion
}) => {
  const classes = styles({});

  return (
    <div className={classes.container}>
      <div
        className={classes.versionItem}
      >{`dashboard v${dashboardVersion}`}</div>
      <div className={classes.versionItem}>{`core v${coreVersion}`} </div>
    </div>
  );
};

AppVersions.displayName = "AppVersions";
export default AppVersions;
