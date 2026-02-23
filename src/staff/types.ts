import { type StaffListQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type StaffMembers = RelayToFlat<NonNullable<StaffListQuery["staffUsers"]>>;
export type StaffMember = StaffMembers[number];
