import { ClickableAttributeClass } from "@dashboard/components/AttributeClass/AttributeClass";
import { AttributeInputTypeTooltip } from "@dashboard/components/AttributeInputTypeIcon/AttributeInputTypeTooltip";
import {
  type AttributeInputTypeEnum,
  type AttributeTypeEnum,
  type MeasurementUnitsEnum,
} from "@dashboard/graphql";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

import styles from "./Title.module.css";

interface AttributeDetailsHeaderAttribute {
  name: string;
  type?: AttributeTypeEnum | null;
  inputType?: AttributeInputTypeEnum | null;
  unit?: MeasurementUnitsEnum | null;
}

interface AttributeDetailsTitleProps {
  attribute?: AttributeDetailsHeaderAttribute | null;
  loading?: boolean;
}

export const AttributeDetailsTitle = ({
  attribute,
  loading,
}: AttributeDetailsTitleProps): JSX.Element | null => {
  const isHeaderLoading = loading && !attribute;

  if (isHeaderLoading) {
    return (
      <div className={styles.container}>
        <Skeleton
          __width="1.25rem"
          __height="1.25rem"
          data-test-id="attribute-details-type-skeleton"
        />
        <Skeleton __width="12em" data-test-id="attribute-details-title-skeleton" />
        <Skeleton __width="6rem" data-test-id="attribute-details-class-skeleton" />
      </div>
    );
  }

  if (!attribute) {
    return null;
  }

  return (
    <div className={styles.container}>
      {attribute.inputType ? (
        <Box className={styles.icon}>
          <AttributeInputTypeTooltip
            inputType={attribute.inputType}
            size="medium"
            unit={attribute.unit}
          />
        </Box>
      ) : null}
      <Box className={styles.name} title={attribute.name}>
        {attribute.name}
      </Box>
      {attribute.type && <ClickableAttributeClass attributeType={attribute.type} size={3} />}
    </div>
  );
};
