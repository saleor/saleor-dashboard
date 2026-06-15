import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { ModelingIcon } from "@dashboard/icons/Modeling";
import { pageListUrlWithPageType } from "@dashboard/modeling/urls";
import { Box, Skeleton, Text, type TextProps } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import { messages } from "./messages";
import styles from "./ModelType.module.css";

type ModelTypeTextSize = NonNullable<TextProps["size"]>;

interface ModelTypeLike {
  id?: string;
  name: string;
}

interface ModelTypeProps {
  /**
   * The model type to display. Pass `undefined` to render a skeleton placeholder while loading.
   */
  modelType: ModelTypeLike | undefined;
  /**
   * Hide the leading model type icon.
   * @default false
   */
  hideIcon?: boolean;
  /**
   * Macaw text size token used for the label.
   * @default 2
   */
  size?: ModelTypeTextSize;
  /**
   * Macaw text color token used for the label.
   * @default "default2"
   */
  color?: TextProps["color"];
  /**
   * Optional override for the `data-test-id` attribute.
   * @default "model-type-display"
   */
  "data-test-id"?: string;
  /**
   * Native hover tooltip for the model type name.
   * @default modelType.name
   */
  title?: string;
}

const ICON_SIZE_BY_TEXT_SIZE: Record<ModelTypeTextSize, number> = {
  1: 12,
  2: 14,
  3: 14,
  4: 16,
  5: 18,
  6: 20,
  7: 24,
  8: 28,
  9: 32,
  10: 36,
  11: 40,
};

export const ModelTypeDisplay = ({
  modelType,
  hideIcon = false,
  size = 2,
  color = "default2",
  "data-test-id": dataTestId = "model-type-display",
  title,
}: ModelTypeProps): JSX.Element => {
  const intl = useIntl();

  if (!modelType) {
    return (
      <Box display="flex" alignItems="center" gap={1} data-test-id={dataTestId}>
        <Skeleton __width="6rem" __height="1rem" />
      </Box>
    );
  }

  const iconSize = ICON_SIZE_BY_TEXT_SIZE[size];
  const ariaLabel = `${intl.formatMessage(messages.modelTypeLabel)}: ${modelType.name}`;
  const nameTitle = title ?? modelType.name;

  return (
    <Text
      size={size}
      color={color}
      fontWeight="medium"
      display="flex"
      alignItems="center"
      gap={1}
      data-test-id={dataTestId}
      aria-label={ariaLabel}
    >
      {!hideIcon && (
        <Box
          className={styles.icon}
          __width={`${iconSize}px`}
          __height={`${iconSize}px`}
          aria-hidden="true"
        >
          <ModelingIcon />
        </Box>
      )}
      <span className={styles.name} title={nameTitle}>
        {modelType.name}
      </span>
    </Text>
  );
};

export const ClickableModelType = (props: ModelTypeProps): JSX.Element => {
  const { modelType } = props;
  const intl = useIntl();
  const userPermissions = useUserPermissions();
  const canViewModels = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_PAGES]);

  if (!modelType?.id || !canViewModels) {
    return <ModelTypeDisplay {...props} />;
  }

  const linkLabel = intl.formatMessage(messages.viewModelsOfModelType, {
    modelTypeName: modelType.name,
  });

  return (
    <RouterLink
      to={pageListUrlWithPageType({ id: modelType.id })}
      className={styles.link}
      title={linkLabel}
      aria-label={linkLabel}
    >
      <ModelTypeDisplay {...props} title={linkLabel} />
    </RouterLink>
  );
};
