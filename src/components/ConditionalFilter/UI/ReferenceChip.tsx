import { SwatchPreview } from "@dashboard/attributes/components/SwatchPreview/SwatchPreview";
import { iconStrokeWidth } from "@dashboard/components/icons";
import { ImageOff } from "lucide-react";
import { type JSX, type ReactNode, useState } from "react";

import {
  resolveVariantReferenceFields,
  toVariantReferencePill,
} from "../API/variantReferenceOption";
import styles from "./ReferenceChip.module.css";
import { type RightOperatorOption } from "./types";

const REFERENCE_THUMBNAIL_ICON_SIZE = 12;
const SWATCH_CHIP_SIZE = 18;

export const ReferenceThumbnail = ({
  url,
  testId = "reference-thumbnail",
}: {
  url?: string;
  testId?: string;
}): JSX.Element => {
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <span className={styles.thumbnailFallback} aria-hidden>
        <ImageOff size={REFERENCE_THUMBNAIL_ICON_SIZE} strokeWidth={iconStrokeWidth} />
      </span>
    );
  }

  return (
    <img
      className={styles.thumbnail}
      src={url}
      alt=""
      onError={() => setFailed(true)}
      data-test-id={testId}
    />
  );
};

export const ReferenceChipField = ({ children }: { children: ReactNode }): JSX.Element => (
  <div className={styles.field} data-reference-chip="">
    {children}
  </div>
);

export const ProductReferenceChipLabel = ({
  name,
  thumbnailUrl,
}: {
  name: string;
  thumbnailUrl?: string;
}): JSX.Element => (
  <span className={styles.chip} data-test-id="product-reference-chip" title={name}>
    <ReferenceThumbnail url={thumbnailUrl} testId="product-reference-thumbnail" />
    <span className={styles.chipName}>{name}</span>
  </span>
);

export const VariantReferenceChipLabel = ({
  productName,
  variantName,
  productThumbnailUrl,
}: {
  productName: string;
  variantName: string;
  productThumbnailUrl?: string;
}): JSX.Element => (
  <span
    className={styles.chip}
    data-test-id="variant-reference-chip"
    title={`${productName} · ${variantName}`}
  >
    <ReferenceThumbnail url={productThumbnailUrl} testId="variant-reference-thumbnail" />
    <span className={styles.chipProduct}>{productName}</span>
    <span className={styles.chipVariant}>{variantName}</span>
  </span>
);

export const SwatchAttributeChipLabel = ({
  name,
  swatchColor,
  swatchFileUrl,
}: {
  name: string;
  swatchColor?: string;
  swatchFileUrl?: string;
}): JSX.Element => (
  <span className={styles.chip} data-test-id="swatch-attribute-chip" title={name}>
    <SwatchPreview
      color={swatchColor}
      imageUrl={swatchFileUrl}
      size={SWATCH_CHIP_SIZE}
      shape="circle"
    />
    <span className={styles.chipName}>{name}</span>
  </span>
);

/** Macaw `Option.label` is typed as string; filter chips render JSX at runtime. */
const toDisplayChipLabel = (chip: JSX.Element): RightOperatorOption["label"] =>
  chip as unknown as RightOperatorOption["label"];

export const toSwatchDisplayChip = (option: RightOperatorOption): RightOperatorOption => ({
  ...option,
  label: toDisplayChipLabel(
    <SwatchAttributeChipLabel
      name={option.label}
      swatchColor={option.swatchColor}
      swatchFileUrl={option.swatchFileUrl}
    />,
  ),
});

export const toProductDisplayChip = (option: RightOperatorOption): RightOperatorOption => ({
  ...option,
  label: toDisplayChipLabel(
    <ProductReferenceChipLabel name={option.label} thumbnailUrl={option.productThumbnailUrl} />,
  ),
});

export const toVariantDisplayChip = (option: RightOperatorOption): RightOperatorOption => {
  const pill = toVariantReferencePill(option);
  const fields = resolveVariantReferenceFields(pill);

  if (!fields) {
    return pill;
  }

  return {
    ...pill,
    label: toDisplayChipLabel(
      <VariantReferenceChipLabel
        productName={fields.productName}
        variantName={fields.variantName}
        productThumbnailUrl={fields.productThumbnailUrl}
      />,
    ),
  };
};

export const restoreReferenceOptions = (
  next: RightOperatorOption[],
  known: RightOperatorOption[],
): RightOperatorOption[] =>
  next.map(item => known.find(option => option.value === item.value) ?? item);
