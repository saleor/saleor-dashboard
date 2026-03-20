import { type AppManifest, appManifestSchema } from "@dashboard/extensions/domain/app-manifest";
import { type ZodIssue } from "zod";

export class ExtensionManifestValidator {
  validateAppManifest(manifestJson: unknown): AppManifest | { issues: ZodIssue[] } {
    const result = appManifestSchema.safeParse(manifestJson);

    if (result.success) {
      return result.data;
    }

    return {
      issues: result.error.issues,
    };
  }
}
