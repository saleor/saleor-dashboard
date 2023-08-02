// @ts-strict-ignore
import { userPermissionGroups } from "@dashboard/permissionGroups/fixtures";
import { staffMember } from "@dashboard/staff/fixtures";
import React from "react";

import StaffDetailsPage, { StaffDetailsPageProps } from "./StaffDetailsPage";

const props: Omit<StaffDetailsPageProps, "classes"> = {
  availablePermissionGroups: [],
  canEditAvatar: false,
  canEditPreferences: false,
  canEditStatus: true,
  canRemove: true,
  disabled: false,
  errors: [],
  fetchMorePermissionGroups: undefined,
  initialSearch: "",
  onChangePassword: () => undefined,
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onSearchChange: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  staffMember: { ...staffMember, permissionGroups: userPermissionGroups },
};

export default {
  title: "Staff / Staff member details",
};

export const Default = () => <StaffDetailsPage {...props} />;

export const Loading = () => (
  <StaffDetailsPage {...props} disabled={true} staffMember={undefined} />
);

export const NotAdmin = () => (
  <StaffDetailsPage {...props} canEditStatus={false} />
);

export const Himself = () => (
  <StaffDetailsPage
    {...props}
    canEditStatus={false}
    canRemove={false}
    canEditAvatar={true}
    canEditPreferences={true}
  />
);
