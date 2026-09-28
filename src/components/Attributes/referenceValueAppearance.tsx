import { getVariantReferenceLine } from "@dashboard/attributes/utils/formatVariantReferenceLabel";
import { ModelTypeChipIcon } from "@dashboard/components/ChipField/ModelTypeChipIcon";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Link } from "@dashboard/components/Link";
import { type ModelTypeIcon } from "@dashboard/components/ModelTypeIcon/constants";
import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import clsx from "clsx";
import { X } from "lucide-react";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import styles from "./ReferenceList.module.css";

export interface ReferenceListValue {
  label: string;
  value: string;
  url?: string;
  icon?: ModelTypeIcon;
  /** Parent product for a variant, shown secondary on the first line. */
  caption?: string;
  thumbnailUrl?: string;
}

const initialsFor = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

export const ReferenceMark = ({
  name,
  thumbnailUrl,
  compact = false,
}: {
  name: string;
  thumbnailUrl?: string | null;
  compact?: boolean;
}) => {
  const className = compact ? styles.chipAvatar : styles.avatar;

  if (thumbnailUrl) {
    return (
      <span className={className} aria-hidden="true">
        <img src={thumbnailUrl} alt="" />
      </span>
    );
  }

  return (
    <span className={className} aria-hidden="true">
      {initialsFor(name)}
    </span>
  );
};

const ReferenceName = ({
  value,
  className,
  children,
}: {
  value: ReferenceListValue;
  className: string;
  children: ReactNode;
}) => {
  if (value.url) {
    return (
      <Link href={value.url} color="secondary" inline={false} className={className}>
        {children}
      </Link>
    );
  }

  return <span className={className}>{children}</span>;
};

export const showsThumbnail = (entityType?: AttributeEntityTypeEnum | null) =>
  entityType === AttributeEntityTypeEnum.PRODUCT ||
  entityType === AttributeEntityTypeEnum.PRODUCT_VARIANT;

const markName = (value: ReferenceListValue, entityType?: AttributeEntityTypeEnum | null) =>
  entityType === AttributeEntityTypeEnum.PRODUCT_VARIANT
    ? (value.caption ?? value.label)
    : value.label;

/** Variant name (primary) and parent product (secondary) on one line. */
export const ReferenceTitle = ({
  value,
  entityType,
  nameClassName,
  secondaryClassName,
  lineClassName,
}: {
  value: ReferenceListValue;
  entityType?: AttributeEntityTypeEnum | null;
  nameClassName: string;
  secondaryClassName: string;
  lineClassName: string;
}) => {
  if (entityType === AttributeEntityTypeEnum.PRODUCT_VARIANT) {
    const line = getVariantReferenceLine(value);

    return (
      <span className={lineClassName}>
        <ReferenceName value={{ ...value, label: line.variantName }} className={nameClassName}>
          {line.variantName}
        </ReferenceName>
        {line.productName ? (
          <span className={secondaryClassName} data-test-id="attribute-reference-product-name">
            {line.productName}
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <ReferenceName value={value} className={nameClassName}>
      {value.label}
    </ReferenceName>
  );
};

/** The variable middle of a list row. Grip, index, and actions stay outside. */
export const ReferenceRowBody = ({
  value,
  entityType,
  subtitle,
  thumbnailUrl,
}: {
  value: ReferenceListValue;
  entityType?: AttributeEntityTypeEnum | null;
  subtitle?: string | null;
  thumbnailUrl?: string | null;
}) => {
  const secondary =
    entityType === AttributeEntityTypeEnum.PRODUCT_VARIANT ? subtitle : subtitle || value.caption;

  if (showsThumbnail(entityType)) {
    return (
      <>
        <ReferenceMark
          name={markName(value, entityType)}
          thumbnailUrl={thumbnailUrl ?? value.thumbnailUrl}
        />
        <div className={styles.copy}>
          <ReferenceTitle
            value={value}
            entityType={entityType}
            lineClassName={styles.titleLine}
            nameClassName={styles.name}
            secondaryClassName={styles.nameSecondary}
          />
          {secondary ? <span className={styles.subtitle}>{secondary}</span> : null}
        </div>
      </>
    );
  }

  if (entityType === AttributeEntityTypeEnum.PAGE) {
    return (
      <>
        <ModelTypeChipIcon icon={value.icon} />
        <ReferenceTitle
          value={value}
          entityType={entityType}
          lineClassName={styles.titleLine}
          nameClassName={styles.name}
          secondaryClassName={styles.nameSecondary}
        />
      </>
    );
  }

  return (
    <ReferenceTitle
      value={value}
      entityType={entityType}
      lineClassName={styles.titleLine}
      nameClassName={styles.name}
      secondaryClassName={styles.nameSecondary}
    />
  );
};

/** The variable middle of a packed chip. Grip and menu stay outside. */
export const ReferenceChipBody = ({
  value,
  entityType,
  thumbnailUrl,
}: {
  value: ReferenceListValue;
  entityType?: AttributeEntityTypeEnum | null;
  thumbnailUrl?: string | null;
}) => {
  if (showsThumbnail(entityType)) {
    return (
      <>
        <ReferenceMark
          name={markName(value, entityType)}
          thumbnailUrl={thumbnailUrl ?? value.thumbnailUrl}
          compact
        />
        <ReferenceTitle
          value={value}
          entityType={entityType}
          lineClassName={styles.titleLine}
          nameClassName={styles.chipName}
          secondaryClassName={styles.nameSecondary}
        />
      </>
    );
  }

  if (entityType === AttributeEntityTypeEnum.PAGE) {
    return (
      <>
        <ModelTypeChipIcon icon={value.icon} />
        <ReferenceTitle
          value={value}
          entityType={entityType}
          lineClassName={styles.titleLine}
          nameClassName={styles.chipName}
          secondaryClassName={styles.nameSecondary}
        />
      </>
    );
  }

  return (
    <ReferenceTitle
      value={value}
      entityType={entityType}
      lineClassName={styles.titleLine}
      nameClassName={styles.chipName}
      secondaryClassName={styles.nameSecondary}
    />
  );
};

/** A selected reference, same chrome as a multi-reference chip. The chip links through. */
export const ReferenceValueChip = ({
  value,
  entityType,
  thumbnailUrl,
  onRemove,
}: {
  value: ReferenceListValue;
  entityType?: AttributeEntityTypeEnum | null;
  thumbnailUrl?: string | null;
  onRemove?: () => void;
}) => {
  const intl = useIntl();
  const body = (
    <ReferenceChipBody
      value={{ ...value, url: undefined }}
      entityType={entityType}
      thumbnailUrl={thumbnailUrl}
    />
  );

  return (
    <span className={clsx(styles.valueChip, !showsThumbnail(entityType) && styles.valueChipIcon)}>
      {value.url ? (
        <Link href={value.url} color="secondary" inline={false} className={styles.valueChipLink}>
          {body}
        </Link>
      ) : (
        body
      )}
      {onRemove ? (
        <button
          type="button"
          className={styles.valueChipRemove}
          data-test-id="button-close"
          aria-label={intl.formatMessage(buttonMessages.remove)}
          onClick={onRemove}
        >
          <X size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
        </button>
      ) : null}
    </span>
  );
};
