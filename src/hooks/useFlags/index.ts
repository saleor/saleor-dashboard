import { useAllEnvFlags, useEnvFlags } from "./env";
import { useAllServiceFlags, useServicehFlags } from "./flagsService";

export const useFlags = FLAGS_SERVICE_ENABLED ? useServicehFlags : useEnvFlags;
export const useAllFlags = FLAGS_SERVICE_ENABLED
  ? useAllServiceFlags
  : useAllEnvFlags;
