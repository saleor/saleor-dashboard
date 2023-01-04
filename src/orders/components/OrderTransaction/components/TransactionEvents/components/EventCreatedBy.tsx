import { appUrl } from "@saleor/apps/urls";
import { AppAvatarFragment, StaffMemberAvatarFragment } from "@saleor/graphql";
import { Avatar, makeStyles } from "@saleor/macaw-ui";
import { getUserInitials, getUserName } from "@saleor/misc";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import React from "react";
import { Link } from "react-router-dom";

interface EventCreatedByProps {
  createdBy: StaffMemberAvatarFragment | AppAvatarFragment | null;
}

const useStyles = makeStyles(
  theme => ({
    userWrapper: {
      display: "inline-flex",
      height: "100%",
      gap: theme.spacing(1),
      alignItems: "center",
      justifyContent: "flex-end",
    },
  }),
  { name: "EventCreatedBy" },
);

export const EventCreatedBy: React.FC<EventCreatedByProps> = ({
  createdBy,
}) => {
  const classes = useStyles();

  if (!createdBy) {
    return null;
  }

  if (createdBy.__typename === "App") {
    return <Link to={appUrl(createdBy.id)}>{createdBy.name}</Link>;
  }

  return (
    <Link
      to={staffMemberDetailsUrl(createdBy.id)}
      className={classes.userWrapper}
    >
      <Avatar
        initials={getUserInitials(createdBy)}
        avatar={createdBy?.avatar?.url}
      />
      {getUserName(createdBy, true)}
    </Link>
  );
};
