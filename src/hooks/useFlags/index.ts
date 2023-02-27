import { useAllEnvFlags, useEnvFlags } from './env';
import { useAllServiceFlags, useServiceFlags } from './flagsService';

export const useFlags = FLAGS_SERVICE_ENABLED ? useServiceFlags : useEnvFlags;
export const useAllFlags = FLAGS_SERVICE_ENABLED ? useAllServiceFlags : useAllEnvFlags;
