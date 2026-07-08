import { type AssignedTypeList } from "@dashboard/attributes/utils/mapAssignedTypeConnection";
import {
  type AssignedTypeRole,
  type MergedAssignedType,
  mergeProductAssignedTypeUsage,
} from "@dashboard/attributes/utils/mergeProductAssignedTypeUsage";
import { DashboardCard } from "@dashboard/components/Card";
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

const UsageTypeRow = ({ name, href, roles }: UsageTypeRowProps) => {
  const intl = useIntl();

  return (
    <Box as="li" className={styles.listItem}>
      <Link href={href} color="secondary" className={styles.typeName}>
        {name}
      </Link>
      {roles && roles.length > 0 && (
        <span className={styles.roleGroup}>
          {roles.includes("product") && (
            <span className={styles.rolePill}>
              {intl.formatMessage(attributeAssignedTypesCardMessages.roleProduct)}
            </span>
          )}
          {roles.includes("variant") && (
            <span className={styles.rolePill}>
              {intl.formatMessage(attributeAssignedTypesCardMessages.roleVariant)}
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

const UsageList = ({ types, getTypeUrl, showRoles }: UsageListProps) => (
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

const UsageCardSkeleton = ({ showRolePills }: UsageCardSkeletonProps) => (
  <Box display="flex" flexDirection="column" gap={3} data-test-id="attribute-usage-card-skeleton">
    <Skeleton __width="65%" __height="1rem" />
    <Box as="ul" className={styles.list}>
      {USAGE_SKELETON_ROW_WIDTHS.map(width => (
        <Box as="li" key={width} className={styles.listItem}>
          <Skeleton className={styles.typeNameSkeleton} __width={width} __height="1rem" />
          {showRolePills && (
            <Skeleton className={styles.rolePillSkeleton} __width="48px" __height="18px" />
          )}
        </Box>
      ))}
    </Box>
  </Box>
);

const UsageEmptyState = ({ message, hintMessage, linkMessage, href }: UsageEmptyStateProps) => (
  <Box display="flex" flexDirection="column" gap={2}>
    <DashboardCard.Subtitle fontSize={3} color="default2">
      <FormattedMessage {...message} />
    </DashboardCard.Subtitle>
    <DashboardCard.Subtitle fontSize={3} color="default2">
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
    </DashboardCard.Subtitle>
  </Box>
);

export const AttributeAssignedTypesCard = ({
  attributeType,
  loading = false,
  productTypes,
  variantTypes,
  modelTypes,
  modelTypesListHasMore = false,
}: AttributeAssignedTypesCardProps) => {
  const intl = useIntl();
  const isProductAttribute = attributeType === AttributeTypeEnum.PRODUCT_TYPE;
  const productUsage = mergeProductAssignedTypeUsage(productTypes, variantTypes);
  const modelTypeCount = modelTypes?.items.length ?? 0;
  const hasProductUsage = productUsage.types.length > 0;
  const hasModelUsage = modelTypeCount > 0;
  const isEmpty = isProductAttribute ? !hasProductUsage : !hasModelUsage;

  const productSummary = (() => {
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

  if (loading) {
    return (
      <DashboardCard data-test-id="attribute-usage-card">
        <DashboardCard.Header>
          <DashboardCard.Title>
            {intl.formatMessage(attributeAssignedTypesCardMessages.title)}
          </DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content>
          <UsageCardSkeleton showRolePills={isProductAttribute} />
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard data-test-id="attribute-usage-card">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(attributeAssignedTypesCardMessages.title)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {isProductAttribute && isEmpty && (
          <UsageEmptyState
            message={attributeAssignedTypesCardMessages.emptyProductUsage}
            hintMessage={attributeAssignedTypesCardMessages.assignOnProductTypeHint}
            linkMessage={attributeAssignedTypesCardMessages.productTypesLink}
            href={productTypeListUrl()}
          />
        )}

        {!isProductAttribute && isEmpty && (
          <UsageEmptyState
            message={attributeAssignedTypesCardMessages.emptyModelUsage}
            hintMessage={attributeAssignedTypesCardMessages.assignOnModelTypeHint}
            linkMessage={attributeAssignedTypesCardMessages.modelTypesLink}
            href={pageTypeListUrl()}
          />
        )}

        {isProductAttribute && hasProductUsage && (
          <Box display="flex" flexDirection="column" gap={3}>
            <Text size={2} color="default2">
              {productSummary}
            </Text>
            <UsageList
              types={productUsage.types}
              getTypeUrl={productTypeUrl}
              showRoles={productUsage.productTypeCount > 0 && productUsage.variantTypeCount > 0}
            />
            {productUsage.hasMore && (
              <Text size={1} color="default2">
                {intl.formatMessage(attributeAssignedTypesCardMessages.truncatedTypes, {
                  count: ASSIGNED_TYPES_QUERY_LIMIT,
                })}
              </Text>
            )}
          </Box>
        )}

        {!isProductAttribute && hasModelUsage && modelTypes && (
          <Box display="flex" flexDirection="column" gap={3}>
            <Text size={2} color="default2">
              {intl.formatMessage(attributeAssignedTypesCardMessages.summaryModelTypes, {
                count: modelTypeCount,
              })}
            </Text>
            <UsageList
              types={modelTypes.items.map(type => ({ ...type, roles: [] }))}
              getTypeUrl={pageTypeUrl}
              showRoles={false}
            />
            {modelTypesListHasMore && (
              <Text size={1} color="default2">
                {intl.formatMessage(attributeAssignedTypesCardMessages.truncatedTypes, {
                  count: ASSIGNED_TYPES_QUERY_LIMIT,
                })}
              </Text>
            )}
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
