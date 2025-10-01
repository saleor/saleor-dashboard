import { Dialog, SingleAction } from "../types";

export type PluginUrlDialog = "clear" | "edit";
export type PluginUrlQueryParams = Dialog<PluginUrlDialog> & SingleAction;
