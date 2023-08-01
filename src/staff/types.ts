import { StaffListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type StaffMembers = RelayToFlat<StaffListQuery["staffUsers"]>;
export type StaffMember = StaffMembers[number];
