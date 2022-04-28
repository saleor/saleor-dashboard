import { userPermissionGroups } from "@saleor/permissionGroups/fixtures";
import StaffDetailsPage, {
  StaffDetailsPageProps
} from "@saleor/staff/components/StaffDetailsPage";
import { staffMember } from "@saleor/staff/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

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
  onBack: () => undefined,
  onChangePassword: () => undefined,
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onSearchChange: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  staffMember: { ...staffMember, permissionGroups: userPermissionGroups }
};

export default {
  title: "Views / Staff / Staff member details",
  decorators: [Decorator]
};

export const Default = () => <StaffDetailsPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <StaffDetailsPage {...props} disabled={true} staffMember={undefined} />
);

Loading.story = {
  name: "loading"
};

export const NotAdmin = () => (
  <StaffDetailsPage {...props} canEditStatus={false} />
);

NotAdmin.story = {
  name: "not admin"
};

export const Himself = () => (
  <StaffDetailsPage
    {...props}
    canEditStatus={false}
    canRemove={false}
    canEditAvatar={true}
    canEditPreferences={true}
  />
);

Himself.story = {
  name: "himself"
};
