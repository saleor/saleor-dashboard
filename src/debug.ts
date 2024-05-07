import debugPkg from "debug";

/**
 * Will console log prefixed message with timestamp, controlled via env
 * Eg. DEBUG=saleor-dashboard:* - enable all
 *     DEUBG=saleor-dashboard:apps:* - enable apps debugger
 */
export const createDebug = (namespace: string) => debugPkg.debug(`saleor-dashboard:${namespace}`);
