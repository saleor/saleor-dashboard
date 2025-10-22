import { AppManifest, appManifestSchema } from "@dashboard/extensions/domain/app-manifest";
import { ZodIssue } from "zod";

//todo test
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
