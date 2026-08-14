import { type AssignedTypeList } from "@dashboard/attributes/utils/mapAssignedTypeConnection";
import {
  type AssignedTypeRole,
  type MergedAssignedType,
  mergeProductAssignedTypeUsage,
} from "@dashboard/attributes/utils/mergeProductAssignedTypeUsage";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { Link } from "@dashboard/components/Link";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { AttributeTypeEnum } from "@dashboard/graphql";
import { pageTypeListUrl, pageTypeUrl } from "@dashboard/modelTypes/urls";
import { productTypeListUrl, productTypeUrl } from "@dashboard/productTypes/urls";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

import styles from "./AttributeAssignedTypesCard.module.css";
import { attributeAssignedTypesCardMessages } from "./messages";

const ASSIGNED_TYPES_QUERY_LIMIT = 100;

export interface AttributeAssignedTypesCardProps {
  attributeType: AttributeTypeEnum.PRODUCT_TYPE | AttributeTypeEnum.PAGE_TYPE;
  loading?: boolean;
  productTypes?: AssignedTypeList;
  variantTypes?: AssignedTypeList;
  modelTypes?: AssignedTypeList;
  modelTypesListHasMore?: boolean;
}

interface UsageTypeRowProps {
  name: string;
  href: string;
  roles?: AssignedTypeRole[];
}

const UsageTypeRow = ({ name, href, roles }: UsageTypeRowProps): JSX.Element => {
  const intl = useIntl();

  return (
    <Box as="li" className={styles.listItem}>
      <Link href={href} color="secondary" className={styles.typeName}>
        <Text size={3} fontWeight="medium" as="span">
          {name}
        </Text>
      </Link>
      {roles && roles.length > 0 && (
        <span className={styles.roleGroup}>
          {roles.includes("product") && (
            <span className={styles.rolePill}>
              <Text size={1} color="default2" fontWeight="medium">
                {intl.formatMessage(attributeAssignedTypesCardMessages.roleProduct)}
              </Text>
            </span>
          )}
          {roles.includes("variant") && (
            <span className={styles.rolePill}>
              <Text size={1} color="default2" fontWeight="medium">
                {intl.formatMessage(attributeAssignedTypesCardMessages.roleVariant)}
              </Text>
            </span>
          )}
        </span>
      )}
    </Box>
  );
};

interface UsageListProps {
  types: MergedAssignedType[];
  getTypeUrl: (id: string) => string;
  showRoles: boolean;
}

const UsageList = ({ types, getTypeUrl, showRoles }: UsageListProps): JSX.Element => (
  <Box as="ul" className={styles.list} data-test-id="attribute-usage-list">
    {types.map(type => (
      <UsageTypeRow
        key={type.id}
        name={type.name}
        href={getTypeUrl(type.id)}
        roles={showRoles ? type.roles : undefined}
      />
    ))}
  </Box>
);

interface UsageEmptyStateProps {
  message: MessageDescriptor;
  hintMessage: MessageDescriptor;
  linkMessage: MessageDescriptor;
  href: string;
}

const USAGE_SKELETON_ROW_WIDTHS = ["55%", "70%", "45%"] as const;

interface UsageCardSkeletonProps {
  showRolePills: boolean;
}

const UsageCardSkeleton = ({ showRolePills }: UsageCardSkeletonProps): JSX.Element => (
  <Box as="ul" className={styles.list} data-test-id="attribute-usage-card-skeleton">
    {USAGE_SKELETON_ROW_WIDTHS.map(width => (
      <Box as="li" key={width} className={styles.listItem}>
        <Skeleton className={styles.typeNameSkeleton} __width={width} __height="1rem" />
        {showRolePills && (
          <Skeleton className={styles.rolePillSkeleton} __width="48px" __height="18px" />
        )}
      </Box>
    ))}
  </Box>
);

const UsageEmptyState = ({
  message,
  hintMessage,
  linkMessage,
  href,
}: UsageEmptyStateProps): JSX.Element => (
  <Box display="flex" flexDirection="column" gap={2}>
    <Text size={3} color="default2">
      <FormattedMessage {...message} />
    </Text>
    <Text size={3} color="default2">
      <FormattedMessage
        {...hintMessage}
        values={{
          link: (
            <MicrocopyLink to={href}>
              <FormattedMessage {...linkMessage} />
            </MicrocopyLink>
          ),
        }}
      />
    </Text>
  </Box>
);

export const AttributeAssignedTypesCard = ({
  attributeType,
  loading = false,
  productTypes,
  variantTypes,
  modelTypes,
  modelTypesListHasMore = false,
}: AttributeAssignedTypesCardProps): JSX.Element => {
  const intl = useIntl();
  const isProductAttribute = attributeType === AttributeTypeEnum.PRODUCT_TYPE;
  const productUsage = mergeProductAssignedTypeUsage(productTypes, variantTypes);
  const modelTypeCount = modelTypes?.items.length ?? 0;
  const hasProductUsage = productUsage.types.length > 0;
  const hasModelUsage = modelTypeCount > 0;
  const isEmpty = isProductAttribute ? !hasProductUsage : !hasModelUsage;

  const productSummary: string | null = ((): string | null => {
    if (!hasProductUsage) {
      return null;
    }

    if (productUsage.productTypeCount > 0 && productUsage.variantTypeCount > 0) {
      return intl.formatMessage(attributeAssignedTypesCardMessages.summaryMixedTypes, {
        productCount: productUsage.productTypeCount,
        variantCount: productUsage.variantTypeCount,
      });
    }

    if (productUsage.variantTypeCount > 0) {
      return intl.formatMessage(attributeAssignedTypesCardMessages.summaryVariantTypes, {
        count: productUsage.variantTypeCount,
      });
    }

    return intl.formatMessage(attributeAssignedTypesCardMessages.summaryProductTypes, {
      count: productUsage.productTypeCount,
    });
  })();

  const usageSubtitle: string | null | undefined = ((): string | null | undefined => {
    if (loading || isEmpty) {
      return undefined;
    }

    if (isProductAttribute) {
      return productSummary;
    }

    return intl.formatMessage(attributeAssignedTypesCardMessages.summaryModelTypes, {
      count: modelTypeCount,
    });
  })();

  const emptyIntro: JSX.Element | undefined = ((): JSX.Element | undefined => {
    if (loading || !isEmpty) {
      return undefined;
    }

    if (isProductAttribute) {
      return (
        <UsageEmptyState
          message={attributeAssignedTypesCardMessages.emptyProductUsage}
          hintMessage={attributeAssignedTypesCardMessages.assignOnProductTypeHint}
          linkMessage={attributeAssignedTypesCardMessages.productTypesLink}
          href={productTypeListUrl()}
        />
      );
    }

    return (
      <UsageEmptyState
        message={attributeAssignedTypesCardMessages.emptyModelUsage}
        hintMessage={attributeAssignedTypesCardMessages.assignOnModelTypeHint}
        linkMessage={attributeAssignedTypesCardMessages.modelTypesLink}
        href={pageTypeListUrl()}
      />
    );
  })();

  return (
    <DetailSettingsCard
      data-test-id="attribute-usage-card"
      title={intl.formatMessage(attributeAssignedTypesCardMessages.title)}
      subtitle={usageSubtitle}
      intro={emptyIntro}
      contentFlush
    >
      {loading ? (
        <UsageCardSkeleton showRolePills={isProductAttribute} />
      ) : (
        <>
          {isProductAttribute && hasProductUsage && (
            <>
              <UsageList
                types={productUsage.types}
                getTypeUrl={productTypeUrl}
                showRoles={productUsage.productTypeCount > 0 && productUsage.variantTypeCount > 0}
              />
              {productUsage.hasMore && (
                <Box className={styles.truncated}>
                  <Text size={2} color="default2">
                    {intl.formatMessage(attributeAssignedTypesCardMessages.truncatedTypes, {
                      count: ASSIGNED_TYPES_QUERY_LIMIT,
                    })}
                  </Text>
                </Box>
              )}
            </>
          )}

          {!isProductAttribute && hasModelUsage && modelTypes && (
            <>
              <UsageList
                types={modelTypes.items.map(type => ({ ...type, roles: [] }))}
                getTypeUrl={pageTypeUrl}
                showRoles={false}
              />
              {modelTypesListHasMore && (
                <Box className={styles.truncated}>
                  <Text size={2} color="default2">
                    {intl.formatMessage(attributeAssignedTypesCardMessages.truncatedTypes, {
                      count: ASSIGNED_TYPES_QUERY_LIMIT,
                    })}
                  </Text>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </DetailSettingsCard>
  );
};
