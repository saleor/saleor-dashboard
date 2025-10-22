import { z } from "zod";

const httpMethodSchema = z.enum(["GET", "POST"], {
  // todo errorMap or message?
  errorMap: () => ({ message: "Method must be either GET or POST" }),
});

const newTabTargetOptionsSchema = z.object({
  method: httpMethodSchema,
});

const widgetTargetOptionsSchema = z.object({
  method: httpMethodSchema,
});

const appExtensionOptionsSchema = z
  .object({
    newTabTarget: newTabTargetOptionsSchema.optional(),
    widgetTarget: widgetTargetOptionsSchema.optional(),
  })
  .refine(
    data => {
      // Only one of newTabTarget or widgetTarget can be set
      return !(data.newTabTarget && data.widgetTarget);
    },
    {
      message: "Only one of 'newTabTarget' or 'widgetTarget' can be set.",
    },
  );

// ============================================================================
// App Extension Enums
// ============================================================================

const AppExtensionTarget = z.enum(["POPUP", "APP_PAGE", "NEW_TAB", "WIDGET"]);

const PRODUCT_MOUNTS = [
  "PRODUCT_OVERVIEW_CREATE",
  "PRODUCT_OVERVIEW_MORE_ACTIONS",
  "PRODUCT_DETAILS_MORE_ACTIONS",
  "PRODUCT_DETAILS_WIDGETS",
] as const;

const NAVIGATION_MOUNTS = [
  "NAVIGATION_CATALOG",
  "NAVIGATION_ORDERS",
  "NAVIGATION_CUSTOMERS",
  "NAVIGATION_DISCOUNTS",
  "NAVIGATION_TRANSLATIONS",
  "NAVIGATION_PAGES",
] as const;

const ORDER_MOUNTS = [
  "ORDER_DETAILS_MORE_ACTIONS",
  "ORDER_OVERVIEW_CREATE",
  "ORDER_DETAILS_WIDGETS",
  "DRAFT_ORDER_DETAILS_WIDGETS",
  "ORDER_OVERVIEW_MORE_ACTIONS",
] as const;

const CUSTOMER_MOUNTS = [
  "CUSTOMER_OVERVIEW_CREATE",
  "CUSTOMER_OVERVIEW_MORE_ACTIONS",
  "CUSTOMER_DETAILS_MORE_ACTIONS",
  "CUSTOMER_DETAILS_WIDGETS",
] as const;

const COLLECTION_MOUNTS = ["COLLECTION_DETAILS_WIDGETS"] as const;

const GIFT_CARD_MOUNTS = ["GIFT_CARD_DETAILS_WIDGETS"] as const;

const VOUCHER_MOUNTS = ["VOUCHER_DETAILS_WIDGETS"] as const;

const AppExtensionMount = z.enum([
  ...PRODUCT_MOUNTS,
  ...NAVIGATION_MOUNTS,
  ...ORDER_MOUNTS,
  ...COLLECTION_MOUNTS,
  ...GIFT_CARD_MOUNTS,
  ...VOUCHER_MOUNTS,
  ...CUSTOMER_MOUNTS,
] as const);

// Subset of mounts available for WIDGET target
const WIDGET_AVAILABLE_MOUNTS = [
  "ORDER_DETAILS_WIDGETS",
  "PRODUCT_DETAILS_WIDGETS",
  "VOUCHER_DETAILS_WIDGETS",
  "DRAFT_ORDER_DETAILS_WIDGETS",
  "GIFT_CARD_DETAILS_WIDGETS",
  "CUSTOMER_DETAILS_WIDGETS",
  "COLLECTION_DETAILS_WIDGETS",
] as const;

const extensionSchema = z
  .object({
    label: z.string().min(1),
    url: z.string().min(1),
    mount: AppExtensionMount,
    target: AppExtensionTarget.default("POPUP"),
    // todo add permissions check
    permissions: z.array(z.string()).optional().default([]),
    options: appExtensionOptionsSchema.optional(),
  })
  .refine(
    data => {
      // Validate that WIDGET target only uses widget-compatible mounts
      if (data.target === "WIDGET") {
        return WIDGET_AVAILABLE_MOUNTS.includes(data.mount as any);
      }

      return true;
    },
    {
      message: "Mount is not available for WIDGET target.",
    },
  )
  .refine(
    data => {
      // Validate widgetTarget options only on WIDGET target
      if (data.options?.widgetTarget && data.target !== "WIDGET") {
        return false;
      }

      return true;
    },
    {
      message: "widgetTarget options must be set only on WIDGET target",
    },
  )
  .refine(
    data => {
      // Validate newTabTarget options only on NEW_TAB target
      if (data.options?.newTabTarget && data.target !== "NEW_TAB") {
        return false;
      }

      return true;
    },
    {
      message: "newTabTarget options must be set only on NEW_TAB target",
    },
  )
  .refine(
    data => {
      // URL validation based on target
      const url = data.url;
      const target = data.target;

      // Relative URL validation
      if (url.startsWith("/")) {
        // APP_PAGE can use relative URLs
        return target === "APP_PAGE";
      }

      // APP_PAGE cannot use absolute URLs
      if (target === "APP_PAGE") {
        return false;
      }

      return true;
    },
    {
      message: "Incorrect relation between extension target and URL fields.",
    },
  );

// ============================================================================
// Main Manifest Validator
// ============================================================================

const manifestSchema = z
  .object({
    name: z.string().min(1),
    appUrl: z.string().optional(),
    permissions: z.array(z.string()).optional().default([]),
    extensions: z.array(extensionSchema).optional().default([]),
  })
  .refine(
    data => {
      // Validate extension URLs require appUrl for certain cases
      return data.extensions.every(ext => {
        if (ext.url.startsWith("/") && ext.target === "NEW_TAB") {
          return !!data.appUrl;
        }

        return true;
      });
    },
    {
      message: "To use relative URL, you must specify appUrl.",
    },
  )
  .refine(
    data => {
      // Validate extension permissions are subset of app permissions
      return data.extensions.every(ext => {
        return ext.permissions.every(perm => data.permissions.includes(perm));
      });
    },
    {
      message: "Extension permission must be listed in App's permissions.",
    },
  );

// ============================================================================
// Export
// ============================================================================

export {
  AppExtensionMount,
  appExtensionOptionsSchema,
  AppExtensionTarget,
  extensionSchema,
  httpMethodSchema,
  manifestSchema,
  newTabTargetOptionsSchema,
  widgetTargetOptionsSchema,
};

export type ManifestData = z.infer<typeof manifestSchema>;
export type ExtensionData = z.infer<typeof extensionSchema>;
export type AppExtensionOptions = z.infer<typeof appExtensionOptionsSchema>;

export class ExtensionManifestValidator {}
