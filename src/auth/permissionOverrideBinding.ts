// DEV-ONLY-PERMISSION-OVERRIDE: Vite may alias this file to permissionOverrideBinding.dev.ts
// when VITE_ENABLE_PERMISSIONS_DEBUGGER=true. TypeScript always type-checks the stub.
export {
  isPermissionsDebuggerEnabled,
  usePermissionOverride,
} from "./permissionOverrideBinding.stub";
