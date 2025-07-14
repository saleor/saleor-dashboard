import { createDebug } from "@dashboard/debug";

/** @deprecated use utility from extensions/ */
export const createAppsDebug = (namespace: string) => createDebug(`apps:${namespace}`);
