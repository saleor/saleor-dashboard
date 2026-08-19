export type ProductSaveStepId =
  | "files"
  | "product"
  | "channels"
  | "variantDelete"
  | "variantCreate"
  | "variantUpdate";

export type ProductSaveStepStatus = "success" | "error" | "skipped";

export interface ProductSaveStepResult {
  id: ProductSaveStepId;
  status: ProductSaveStepStatus;
}

export const createInitialProductSaveSteps = (): ProductSaveStepResult[] => [
  { id: "files", status: "skipped" },
  { id: "product", status: "skipped" },
  { id: "channels", status: "skipped" },
  { id: "variantDelete", status: "skipped" },
  { id: "variantCreate", status: "skipped" },
  { id: "variantUpdate", status: "skipped" },
];

export const setProductSaveStepStatus = (
  steps: ProductSaveStepResult[],
  id: ProductSaveStepId,
  status: ProductSaveStepStatus,
): ProductSaveStepResult[] => steps.map(step => (step.id === id ? { ...step, status } : step));

export const hasFailedProductSaveStep = (steps: ProductSaveStepResult[]): boolean =>
  steps.some(step => step.status === "error");

export const hasSucceededProductSaveStep = (steps: ProductSaveStepResult[]): boolean =>
  steps.some(step => step.status === "success");
