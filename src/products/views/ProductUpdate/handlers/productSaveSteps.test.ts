import {
  createInitialProductSaveSteps,
  hasFailedProductSaveStep,
  hasSucceededProductSaveStep,
  type ProductSaveStepResult,
  setProductSaveStepStatus,
} from "./productSaveSteps";

/** Mirrors gating in useProductUpdateHandler.sendMutations for regression safety. */
const applyPipelineOutcomes = ({
  attemptedFiles,
  fileFailed,
  productFailed,
  attemptedChannels,
  channelFailed,
  attemptedVariantDelete,
  variantDeleteFailed,
  attemptedVariantCreate,
  variantCreateFailed,
  attemptedVariantUpdate,
  variantUpdateFailed,
}: {
  attemptedFiles?: boolean;
  fileFailed?: boolean;
  productFailed: boolean;
  attemptedChannels?: boolean;
  channelFailed?: boolean;
  attemptedVariantDelete?: boolean;
  variantDeleteFailed?: boolean;
  attemptedVariantCreate?: boolean;
  variantCreateFailed?: boolean;
  attemptedVariantUpdate?: boolean;
  variantUpdateFailed?: boolean;
}): ProductSaveStepResult[] => {
  let steps = createInitialProductSaveSteps();

  if (attemptedFiles) {
    steps = setProductSaveStepStatus(steps, "files", fileFailed ? "error" : "success");
  }

  steps = setProductSaveStepStatus(steps, "product", productFailed ? "error" : "success");

  if (attemptedChannels) {
    if (productFailed) {
      steps = setProductSaveStepStatus(steps, "channels", "skipped");
    } else {
      steps = setProductSaveStepStatus(steps, "channels", channelFailed ? "error" : "success");
    }
  }

  if (attemptedVariantDelete) {
    steps = setProductSaveStepStatus(
      steps,
      "variantDelete",
      variantDeleteFailed ? "error" : "success",
    );
  }

  if (attemptedVariantCreate) {
    steps = setProductSaveStepStatus(
      steps,
      "variantCreate",
      variantCreateFailed ? "error" : "success",
    );
  }

  if (attemptedVariantUpdate) {
    steps = setProductSaveStepStatus(
      steps,
      "variantUpdate",
      variantUpdateFailed ? "error" : "success",
    );
  }

  return steps;
};

describe("productSaveSteps", () => {
  it("starts with every step skipped", () => {
    // Arrange / Act
    const steps = createInitialProductSaveSteps();

    // Assert
    expect(steps.every(step => step.status === "skipped")).toBe(true);
    expect(hasFailedProductSaveStep(steps)).toBe(false);
    expect(hasSucceededProductSaveStep(steps)).toBe(false);
  });

  it("updates a single step status immutably", () => {
    // Arrange
    const steps = createInitialProductSaveSteps();

    // Act
    const next = setProductSaveStepStatus(steps, "product", "success");
    const failed = setProductSaveStepStatus(next, "channels", "error");

    // Assert
    expect(steps.find(step => step.id === "product")?.status).toBe("skipped");
    expect(next.find(step => step.id === "product")?.status).toBe("success");
    expect(failed.find(step => step.id === "channels")?.status).toBe("error");
    expect(hasSucceededProductSaveStep(failed)).toBe(true);
    expect(hasFailedProductSaveStep(failed)).toBe(true);
  });

  it("marks channels skipped when product update failed (handler gating)", () => {
    // Arrange / Act
    const steps = applyPipelineOutcomes({
      productFailed: true,
      attemptedChannels: true,
    });

    // Assert
    expect(steps.find(step => step.id === "product")?.status).toBe("error");
    expect(steps.find(step => step.id === "channels")?.status).toBe("skipped");
    expect(hasFailedProductSaveStep(steps)).toBe(true);
    expect(hasSucceededProductSaveStep(steps)).toBe(false);
  });

  it("keeps product success when a later channel step fails", () => {
    // Arrange / Act
    const steps = applyPipelineOutcomes({
      productFailed: false,
      attemptedChannels: true,
      channelFailed: true,
    });

    // Assert
    expect(steps.find(step => step.id === "product")?.status).toBe("success");
    expect(steps.find(step => step.id === "channels")?.status).toBe("error");
    expect(hasSucceededProductSaveStep(steps)).toBe(true);
    expect(hasFailedProductSaveStep(steps)).toBe(true);
  });

  it("reports mixed variant pipeline outcomes", () => {
    // Arrange / Act
    const steps = applyPipelineOutcomes({
      productFailed: false,
      attemptedVariantDelete: true,
      variantDeleteFailed: false,
      attemptedVariantCreate: true,
      variantCreateFailed: true,
      attemptedVariantUpdate: true,
      variantUpdateFailed: false,
    });

    // Assert
    expect(steps.find(step => step.id === "variantDelete")?.status).toBe("success");
    expect(steps.find(step => step.id === "variantCreate")?.status).toBe("error");
    expect(steps.find(step => step.id === "variantUpdate")?.status).toBe("success");
  });

  it("leaves unattempted steps skipped on full success", () => {
    // Arrange / Act
    const steps = applyPipelineOutcomes({
      productFailed: false,
    });

    // Assert
    expect(steps.find(step => step.id === "product")?.status).toBe("success");
    expect(steps.find(step => step.id === "files")?.status).toBe("skipped");
    expect(steps.find(step => step.id === "channels")?.status).toBe("skipped");
    expect(steps.find(step => step.id === "variantDelete")?.status).toBe("skipped");
    expect(hasFailedProductSaveStep(steps)).toBe(false);
  });
});
