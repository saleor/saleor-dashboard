import { Typography } from "@material-ui/core";
import React from "react";

import { useStyles } from "./styles";
interface VersionInfoProps {
  dashboardVersion: string;
  coreVersion: string;
}

const VersionInfo: React.FC<VersionInfoProps> = ({
  dashboardVersion,
  coreVersion
}) => {
  const classes = useStyles({});

  return dashboardVersion && coreVersion ? (
    <Typography variant="caption" className={classes.container}>
      <div
        className={classes.versionItem}
      >{`dashboard v${dashboardVersion}`}</div>
      <div className={classes.versionItem}>{`core v${coreVersion}`}</div>
    </Typography>
  ) : null;
};

VersionInfo.displayName = "VersionInfo";
export default VersionInfo;
