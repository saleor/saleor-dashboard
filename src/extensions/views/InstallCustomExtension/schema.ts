import { z } from "zod";

export const MANIFEST_URL_CLIENT_VALIDATION_REQUIRED = "MANIFEST_URL_CLIENT_VALIDATION_REQUIRED";
export const MANIFEST_URL_CLIENT_VALIDATION_INVALID_FORMAT =
  "MANIFEST_URL_CLIENT_VALIDATION_INVALID_FORMAT";

export const manifestFormSchema = z.object({
  manifestUrl: z
    .string()
    // Note: error messages are treated as codes and will be mapped to correct error by form
    .min(1, MANIFEST_URL_CLIENT_VALIDATION_REQUIRED)
    .url(MANIFEST_URL_CLIENT_VALIDATION_INVALID_FORMAT),
});

// Due to disabled strictNullChecks in tsconfig.json, we need to use Required<z.infer<...>> to get the correct type
export type ExtensionInstallFormData = Required<z.infer<typeof manifestFormSchema>>;
