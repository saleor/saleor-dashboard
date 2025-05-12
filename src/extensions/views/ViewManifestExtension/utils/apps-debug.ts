import { createDebug } from "@dashboard/debug";

export const createAppsDebug = (namespace: string) => createDebug(`apps:${namespace}`);
