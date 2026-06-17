import { extractMutationErrors } from "@dashboard/misc";

import { type TranslationMutationError } from "./bulkSubmitResult";

export async function extractTranslationMutationErrors(
  submitPromise: Promise<unknown>,
): Promise<TranslationMutationError[]> {
  return extractMutationErrors(submitPromise as Parameters<typeof extractMutationErrors>[0]);
}
