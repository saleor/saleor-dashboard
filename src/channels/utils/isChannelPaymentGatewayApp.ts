import { AppTypeEnum, PermissionEnum } from "@dashboard/graphql";

interface PaymentGatewayAppCandidate {
  type: AppTypeEnum | null;
  permissions?: Array<{ code: PermissionEnum }> | null;
}

/** Installed manifest apps with payment permission — excludes dashboard-created local apps/tokens. */
export const isChannelPaymentGatewayApp = (app: PaymentGatewayAppCandidate): boolean =>
  app.type === AppTypeEnum.THIRDPARTY &&
  !!app.permissions?.some(permission => permission.code === PermissionEnum.HANDLE_PAYMENTS);
