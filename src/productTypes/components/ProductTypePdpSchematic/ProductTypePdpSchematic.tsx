import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { PaperSignIcon } from "@dashboard/icons/PaperSignIcon";
import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Image, ShoppingCart } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  getPdpSchematicModel,
  isColorAttributeName,
  type PdpSchematicNamedAttribute,
} from "./getPdpSchematicModel";
import { messages } from "./messages";
import styles from "./ProductTypePdpSchematic.module.css";

const PLACEHOLDER_OPTION_COUNT = 3;

export interface ProductTypePdpSchematicProps {
  hasVariants: boolean;
  productAttributes:
    | Array<{
        id: string;
        name?: string | null;
        choices?: {
          edges: Array<{ node: { name?: string | null } }>;
        } | null;
      }>
    | null
    | undefined;
  assignedVariantAttributes:
    | Array<{
        variantSelection: boolean;
        attribute: {
          id: string;
          name?: string | null;
          choices?: {
            edges: Array<{ node: { name?: string | null } }>;
          } | null;
        };
      }>
    | null
    | undefined;
  selectedVariantAttributeIds: string[];
  onDismiss?: () => void;
  loading?: boolean;
}

const OptionPlaceholders = ({
  name,
  sampleValue,
}: {
  name: string;
  sampleValue: string | null;
}): JSX.Element => {
  const useSwatches = isColorAttributeName(name);

  return (
    <Box className={styles.optionControls} aria-hidden>
      {Array.from({ length: PLACEHOLDER_OPTION_COUNT }, (_, index) =>
        useSwatches ? (
          <Box key={index} className={clsx(styles.swatch, index === 0 && styles.swatchSelected)} />
        ) : (
          <Box key={index} className={clsx(styles.pill, index === 0 && styles.pillSelected)}>
            {index === 0 && sampleValue ? (
              <span className={styles.pillLabel}>{sampleValue}</span>
            ) : null}
          </Box>
        ),
      )}
    </Box>
  );
};

const OptionRows = ({ attributes }: { attributes: PdpSchematicNamedAttribute[] }): JSX.Element => (
  <>
    {attributes.map(attribute => (
      <Box key={attribute.id} className={styles.optionRow} data-test-id="pdp-schematic-option">
        <Text as="span" className={styles.optionName}>
          {attribute.name}
        </Text>
        <OptionPlaceholders name={attribute.name} sampleValue={attribute.sampleValue} />
      </Box>
    ))}
  </>
);

const SampleValue = ({ value }: { value: string | null }): JSX.Element =>
  value ? (
    <Text as="span" className={styles.specValue}>
      {value}
    </Text>
  ) : (
    <Box
      className={styles.sampleSkeleton}
      data-test-id="pdp-schematic-sample-skeleton"
      aria-hidden
    />
  );

const optionNameMarkup = {
  em: (...chunks: ReactNode[]): JSX.Element => (
    <Box as="em" fontStyle="italic">
      {chunks}
    </Box>
  ),
};

const LegendItem = ({
  region,
  iconClassName,
  titleClassName,
  title,
  body,
}: {
  region: "options" | "specs" | "facts";
  iconClassName: string;
  titleClassName: string;
  title: ReactNode;
  body: ReactNode;
}): JSX.Element => (
  <Box as="li" className={styles.legendItem} data-schematic-region={region}>
    <Box className={styles.legendLeading} aria-hidden>
      <Box className={clsx(styles.legendIcon, iconClassName)} />
    </Box>
    <Box className={styles.legendCopy}>
      <Text as="span" size={3} fontWeight="medium" className={titleClassName}>
        {title}
      </Text>
      <Text as="span" size={2} color="default2">
        {body}
      </Text>
    </Box>
  </Box>
);

const SchematicLoadingRegions = (): JSX.Element => (
  <>
    <Box className={clsx(styles.region, styles.regionOptions)}>
      <Text as="span" className={styles.regionLabel}>
        <FormattedMessage {...messages.shopperPicks} />
      </Text>
      {Array.from({ length: 2 }, (_, index) => (
        <Box key={index} className={styles.optionRow} aria-hidden>
          <Box className={clsx(styles.sampleSkeleton, styles.optionNameSkeleton)} />
          <Box className={styles.optionControls}>
            <Box className={styles.pill} />
            <Box className={styles.pill} />
            <Box className={styles.pill} />
          </Box>
        </Box>
      ))}
    </Box>
    <Box className={clsx(styles.region, styles.regionFacts)}>
      <Text as="span" className={styles.regionLabel}>
        <FormattedMessage {...messages.variantFacts} />
      </Text>
      <Box className={styles.badges} aria-hidden>
        <Box className={styles.sampleSkeleton} />
        <Box className={styles.sampleSkeleton} />
      </Box>
    </Box>
  </>
);

const SchematicLoadingSpecs = (): JSX.Element => (
  <>
    {Array.from({ length: 2 }, (_, index) => (
      <Box key={index} className={styles.specRow} aria-hidden>
        <Box className={clsx(styles.sampleSkeleton, styles.optionNameSkeleton)} />
        <Box className={styles.sampleSkeleton} />
      </Box>
    ))}
  </>
);

export const ProductTypePdpSchematic = ({
  hasVariants,
  productAttributes,
  assignedVariantAttributes,
  selectedVariantAttributeIds,
  onDismiss,
  loading = false,
}: ProductTypePdpSchematicProps): JSX.Element => {
  const intl = useIntl();
  const { theme } = useTheme();
  const { optionAttributes, badgeAttributes, specAttributes } = getPdpSchematicModel({
    hasVariants,
    productAttributes,
    assignedVariantAttributes,
    selectedVariantAttributeIds,
  });

  return (
    <Box
      className={clsx(styles.card, styles.elevated, theme === "defaultDark" && styles.elevatedDark)}
      data-test-id="product-type-pdp-schematic"
    >
      <Box className={styles.copy}>
        <Text size={5} fontWeight="bold" as="h2">
          <FormattedMessage {...messages.title} />
        </Text>
        <Box className={styles.subtitleRow}>
          <Box
            as="span"
            className={styles.legendIcon}
            color="default1"
            data-test-id="pdp-schematic-paper-mark"
            aria-label={intl.formatMessage(messages.badge)}
          >
            <PaperSignIcon size={iconSize.small} />
          </Box>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.subtitle} />
          </Text>
        </Box>
      </Box>

      <Box
        as="figure"
        className={styles.visual}
        aria-label={intl.formatMessage(messages.figureLabel)}
        aria-busy={loading || undefined}
        data-test-id={loading ? "pdp-schematic-loading" : undefined}
      >
        <Box className={clsx(styles.pdp, loading && styles.pdpLoading)}>
          <Box className={styles.galleryCol} aria-hidden>
            <Box className={styles.gallery} data-test-id="pdp-schematic-image">
              <Box className={styles.galleryFrame}>
                <Image
                  size={iconSize.large}
                  strokeWidth={iconStrokeWidthBySize.large}
                  aria-hidden
                />
              </Box>
              <Box className={clsx(styles.galleryFrame, styles.galleryFrameCut)}>
                <Image
                  size={iconSize.large}
                  strokeWidth={iconStrokeWidthBySize.large}
                  aria-hidden
                />
              </Box>
            </Box>
          </Box>

          <Box className={styles.buyBox}>
            <Box className={styles.productName} aria-hidden />
            <Box className={styles.price} aria-hidden />

            {loading ? (
              <SchematicLoadingRegions />
            ) : (
              <>
                <Box className={clsx(styles.region, styles.regionOptions)}>
                  <Text as="span" className={styles.regionLabel}>
                    <FormattedMessage {...messages.shopperPicks} />
                  </Text>
                  {hasVariants ? (
                    optionAttributes.length > 0 ? (
                      <OptionRows attributes={optionAttributes} />
                    ) : (
                      <Text as="span" className={styles.emptyHint}>
                        <FormattedMessage {...messages.assignOptions} />
                      </Text>
                    )
                  ) : (
                    <Text
                      as="span"
                      className={styles.emptyHint}
                      data-test-id="pdp-schematic-no-pickers"
                    >
                      <FormattedMessage {...messages.noPickers} />
                    </Text>
                  )}
                </Box>

                <Box
                  className={clsx(styles.region, styles.regionFacts)}
                  data-test-id="pdp-schematic-badges"
                >
                  <Text as="span" className={styles.regionLabel}>
                    <FormattedMessage {...messages.variantFacts} />
                  </Text>
                  {hasVariants && badgeAttributes.length > 0 ? (
                    <Box className={styles.badges}>
                      {badgeAttributes.map(attribute =>
                        attribute.sampleValue ? (
                          <Box as="span" key={attribute.id} className={styles.badgeChip}>
                            {attribute.sampleValue}
                          </Box>
                        ) : (
                          <Box
                            key={attribute.id}
                            className={styles.sampleSkeleton}
                            data-test-id="pdp-schematic-sample-skeleton"
                            aria-hidden
                          />
                        ),
                      )}
                    </Box>
                  ) : (
                    <Text as="span" className={styles.emptyHint}>
                      <FormattedMessage
                        {...(hasVariants ? messages.assignFacts : messages.factsNeedOptions)}
                        values={optionNameMarkup}
                      />
                    </Text>
                  )}
                </Box>
              </>
            )}

            <Box className={styles.cta} aria-hidden>
              <ShoppingCart size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
            </Box>
          </Box>

          <Box
            className={clsx(styles.specsCol, styles.region, styles.regionSpecs)}
            data-test-id="pdp-schematic-specs"
          >
            <Text as="span" className={styles.regionLabel}>
              <FormattedMessage {...messages.productDetails} />
            </Text>
            {loading ? (
              <Box className={styles.specList}>
                <SchematicLoadingSpecs />
              </Box>
            ) : specAttributes.length > 0 ? (
              <Box className={styles.specList}>
                {specAttributes.map(attribute => (
                  <Box
                    key={attribute.id}
                    className={styles.specRow}
                    data-test-id="pdp-schematic-spec"
                  >
                    <Text as="span" className={styles.specName}>
                      {attribute.name}
                    </Text>
                    <SampleValue value={attribute.sampleValue} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Text as="span" className={styles.emptyHint}>
                <FormattedMessage {...messages.assignAttributes} />
              </Text>
            )}
          </Box>
        </Box>
      </Box>

      <Box className={styles.legend} data-test-id="pdp-schematic-legend">
        <Box className={styles.legendHeader}>
          <Text as="h3" className={styles.legendHeaderTitle}>
            <FormattedMessage {...messages.legendSection} />
          </Text>
        </Box>
        <Box as="ul" className={styles.legendList}>
          <LegendItem
            region="specs"
            iconClassName={styles.legendIconSpecs}
            titleClassName={styles.legendTitleSpecs}
            title={<FormattedMessage {...messages.productDetails} />}
            body={<FormattedMessage {...messages.legendSpecs} />}
          />
          <LegendItem
            region="options"
            iconClassName={styles.legendIconOptions}
            titleClassName={styles.legendTitleOptions}
            title={<FormattedMessage {...messages.shopperPicks} />}
            body={<FormattedMessage {...messages.legendOptions} values={optionNameMarkup} />}
          />
          <LegendItem
            region="facts"
            iconClassName={styles.legendIconFacts}
            titleClassName={styles.legendTitleFacts}
            title={<FormattedMessage {...messages.variantFacts} />}
            body={<FormattedMessage {...messages.legendFacts} values={optionNameMarkup} />}
          />
        </Box>
      </Box>

      {onDismiss ? (
        <Box className={styles.footer}>
          <Button
            variant="tertiary"
            type="button"
            onClick={onDismiss}
            disabled={loading}
            data-test-id="pdp-schematic-dismiss"
          >
            <FormattedMessage {...messages.dismiss} />
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};
