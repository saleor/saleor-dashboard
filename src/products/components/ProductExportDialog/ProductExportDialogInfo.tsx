// @ts-strict-ignore
import Accordion, { AccordionProps } from "@dashboard/components/Accordion";
import { useChannelsSearch } from "@dashboard/components/ChannelsAvailabilityDialog/utils";
import ChannelsAvailabilityDialogChannelsList from "@dashboard/components/ChannelsAvailabilityDialogChannelsList";
import ChannelsAvailabilityDialogContentWrapper from "@dashboard/components/ChannelsAvailabilityDialogWrapper";
import Checkbox from "@dashboard/components/Checkbox";
import Chip from "@dashboard/components/Chip";
import Hr from "@dashboard/components/Hr";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { ChannelFragment, ExportProductsInput, ProductFieldEnum } from "@dashboard/graphql";
import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { sectionNames } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import { toggle } from "@dashboard/utils/lists";
import { Button, FormControlLabel, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Option as MacawOptionType, Text } from "@saleor/macaw-ui-next";
import { PropsWithChildren } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useProductExportFieldMessages from "./messages";

export const attributeNamePrefix = "attribute-";
export const warehouseNamePrefix = "warehouse-";

const maxChips = 4;
const inventoryFields = [
  ProductFieldEnum.PRODUCT_WEIGHT,
  ProductFieldEnum.VARIANT_ID,
  ProductFieldEnum.VARIANT_SKU,
  ProductFieldEnum.VARIANT_WEIGHT,
];
const useStyles = makeStyles(
  theme => ({
    accordion: {
      marginBottom: theme.spacing(2),
    },
    checkbox: {
      position: "relative",
      right: theme.spacing(-1.5),
    },
    chip: {
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(),
    },
    dialogLabel: {
      marginBottom: theme.spacing(2),
    },
    hr: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3),
    },
    hrWarehouses: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(1),
    },
    label: {
      "&&": {
        overflow: "visible",
      },
      "&:first-of-type": {
        paddingTop: 0,
      },
      "&:not(:last-of-type)": {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
      justifyContent: "space-between",
      margin: theme.spacing(0),
      padding: theme.spacing(1, 0),
      width: "100%",
    },
    loadMoreContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(2),
    },
    moreLabel: {
      display: "inline-block",
      marginBottom: theme.spacing(),
    },
    optionLabel: {
      fontSize: 14,
      marginLeft: 0,
    },
    quickPeekContainer: {
      marginBottom: theme.spacing(-1),
    },
    warehousesLabel: {
      marginBottom: theme.spacing(2),
    },
    scrollArea: {
      maxHeight: "calc(100vh - 390px)",
      minHeight: "auto",
      "@media (min-height: 800px)": {
        minHeight: 440,
      },
      overflowY: "auto",
      overflowX: "hidden",
    },
  }),
  {
    name: "ProductExportDialogInfo",
  },
);
const Option = ({
  checked,
  children,
  name,
  onChange,
}: PropsWithChildren<{
  checked: boolean;
  name: string;
  onChange: (event: ChangeEvent) => void;
}>) => {
  const classes = useStyles({});

  return (
    <FormControlLabel
      classes={{
        label: classes.optionLabel,
      }}
      color="primary"
      control={
        <Checkbox className={classes.checkbox} checked={checked} name={name} onChange={onChange} />
      }
      className={classes.label}
      label={children}
      labelPlacement="start"
    />
  );
};
const FieldAccordion = ({
  data,
  fields,
  onChange,
  onToggleAll,
  ...props
}: AccordionProps & {
  data: ExportProductsInput;
  fields: ProductFieldEnum[];
  onChange: (event: ChangeEvent) => void;
  onToggleAll: (field: ProductFieldEnum[], setTo: boolean) => void;
}) => {
  const classes = useStyles({});
  const getFieldLabel = useProductExportFieldMessages();
  const selectedAll = fields.every(field => data.exportInfo.fields.includes(field));
  const selectedFields = data.exportInfo.fields.filter(field => fields.includes(field));

  return (
    <Accordion
      quickPeek={
        selectedFields.length > 0 && (
          <div className={classes.quickPeekContainer}>
            {selectedFields.slice(0, maxChips).map(field => (
              <Chip
                className={classes.chip}
                label={getFieldLabel(field)}
                onClose={() =>
                  onChange({
                    target: {
                      name: field,
                      value: false,
                    },
                  })
                }
                key={field}
              />
            ))}
            {selectedFields.length > maxChips && (
              <Text className={classes.moreLabel} size={2} fontWeight="light">
                <FormattedMessage
                  id="ve/Sph"
                  defaultMessage="and {number} more"
                  description="there are more elements of list that are hidden"
                  values={{
                    number: selectedFields.length - maxChips,
                  }}
                />
              </Text>
            )}
          </div>
        )
      }
      {...props}
    >
      <Option checked={selectedAll} name="all" onChange={() => onToggleAll(fields, !selectedAll)}>
        <FormattedMessage
          id="lQRnYK"
          defaultMessage="Select All"
          description="selectt all options"
        />
      </Option>
      {fields.map(field => (
        <Option
          checked={data.exportInfo.fields.includes(field)}
          name={field}
          onChange={onChange}
          key={field}
        >
          {getFieldLabel(field)}
        </Option>
      ))}
    </Accordion>
  );
};

interface ProductExportDialogInfoProps extends FetchMoreProps {
  attributes: MacawOptionType[];
  channels: ChannelFragment[];
  selectedChannels: ChannelFragment[];
  warehouses: MacawOptionType[];
  data: ExportProductsInput;
  selectedAttributes: MacawOptionType[];
  onAttrtibuteSelect: FormChange;
  onWarehouseSelect: FormChange;
  onChange: FormChange;
  onFetch: (query: string) => void;
  onSelectAllWarehouses: FormChange;
  onSelectAllChannels: (items: ChannelFragment[], selected: number) => void;
  onChannelSelect: (option: ChannelFragment) => void;
}

const ProductExportDialogInfo = ({
  attributes,
  channels,
  data,
  hasMore,
  selectedAttributes,
  selectedChannels,
  loading,
  warehouses,
  onAttrtibuteSelect,
  onWarehouseSelect,
  onChannelSelect,
  onChange,
  onFetch,
  onFetchMore,
  onSelectAllChannels,
  onSelectAllWarehouses,
}: ProductExportDialogInfoProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);
  const getFieldLabel = useProductExportFieldMessages();
  const {
    query: channelsQuery,
    onQueryChange: onChannelsQueryChange,
    filteredChannels,
  } = useChannelsSearch(channels);
  const handleFieldChange = (event: ChangeEvent) =>
    onChange({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          fields: toggle(event.target.name, data.exportInfo.fields, (a, b) => a === b),
        },
      },
    });
  const handleToggleAllFields = (fields: ProductFieldEnum[], setTo: boolean) =>
    onChange({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          fields: setTo
            ? [
                ...data.exportInfo.fields,
                ...fields.filter(field => !data.exportInfo.fields.includes(field)),
              ]
            : data.exportInfo.fields.filter(field => !fields.includes(field)),
        },
      },
    });
  const selectedInventoryFields = data.exportInfo.fields.filter(field =>
    inventoryFields.includes(field),
  );
  const selectedAllInventoryFields = selectedInventoryFields.length === inventoryFields.length;
  const handleSelectAllChannels = () => onSelectAllChannels(selectedChannels, channels.length);

  return (
    <>
      <Text className={classes.dialogLabel}>
        <FormattedMessage
          id="Jwuu4X"
          defaultMessage="Information exported:"
          description="select product informations to be exported"
        />
      </Text>
      <div className={classes.scrollArea}>
        <Accordion
          dataTestId="channel-expand-button"
          className={classes.accordion}
          title={intl.formatMessage(sectionNames.channels)}
          quickPeek={
            selectedChannels.length > 0 && (
              <div className={classes.quickPeekContainer}>
                {selectedChannels.slice(0, maxChips).map(channel => (
                  <Chip
                    className={classes.chip}
                    label={channel.name}
                    onClose={() => onChannelSelect(channel)}
                    key={channel.id}
                  />
                ))}
                {selectedChannels.length > maxChips && (
                  <Text className={classes.moreLabel} size={2} fontWeight="light">
                    <FormattedMessage
                      id="ve/Sph"
                      defaultMessage="and {number} more"
                      description="there are more elements of list that are hidden"
                      values={{
                        number: selectedChannels.length - maxChips,
                      }}
                    />
                  </Text>
                )}
              </div>
            )
          }
          data-test-id="channels"
        >
          <ChannelsAvailabilityDialogContentWrapper
            hasAnyChannelsToDisplay={!!channels.length}
            hasAllSelected={selectedChannels.length === channels.length}
            query={channelsQuery}
            onQueryChange={onChannelsQueryChange}
            toggleAll={handleSelectAllChannels}
          >
            <ChannelsAvailabilityDialogChannelsList
              channels={filteredChannels}
              isChannelSelected={option =>
                !!selectedChannels.find(channel => channel.id === option.id)
              }
              onChange={onChannelSelect}
            />
          </ChannelsAvailabilityDialogContentWrapper>
        </Accordion>
        <FieldAccordion
          className={classes.accordion}
          title={intl.formatMessage({
            id: "64aYF0",
            defaultMessage: "Product Organization",
            description: "informations about product organization, header",
          })}
          data={data}
          fields={[
            ProductFieldEnum.CATEGORY,
            ProductFieldEnum.COLLECTIONS,
            ProductFieldEnum.PRODUCT_TYPE,
          ]}
          onChange={handleFieldChange}
          onToggleAll={handleToggleAllFields}
          data-test-id="organization"
        />
        <Accordion
          className={classes.accordion}
          title={intl.formatMessage(sectionNames.attributes)}
          quickPeek={
            selectedAttributes.length > 0 && (
              <div className={classes.quickPeekContainer}>
                {selectedAttributes.slice(0, maxChips).map(attribute => (
                  <Chip
                    className={classes.chip}
                    label={attribute.label}
                    onClose={() =>
                      onAttrtibuteSelect({
                        target: {
                          name: attributeNamePrefix + attribute.value,
                          value: undefined,
                        },
                      })
                    }
                    key={attribute.value}
                  />
                ))}
                {selectedAttributes.length > maxChips && (
                  <Text className={classes.moreLabel} size={2} fontWeight="light">
                    <FormattedMessage
                      id="ve/Sph"
                      defaultMessage="and {number} more"
                      description="there are more elements of list that are hidden"
                      values={{
                        number: selectedAttributes.length - maxChips,
                      }}
                    />
                  </Text>
                )}
              </div>
            )
          }
          data-test-id="attributes"
        >
          <TextField
            data-test-id="attribute-search-input"
            name="query"
            value={query}
            onChange={onQueryChange}
            label={intl.formatMessage({
              id: "YicEbK",
              defaultMessage: "Search Atrtibuttes",
            })}
            placeholder={intl.formatMessage({
              id: "tIc2/h",
              defaultMessage: "Search by attribute name",
              description: "input helper text, search attributes",
            })}
            fullWidth
            InputProps={{
              autoComplete: "off",
              endAdornment: loading && <SaleorThrobber size={16} />,
            }}
          />
          <Hr className={classes.hr} />
          {attributes.map(attribute => (
            <Option
              checked={data.exportInfo.attributes.includes(attribute.value)}
              name={attributeNamePrefix + attribute.value}
              onChange={onAttrtibuteSelect}
              key={attribute.value}
            >
              {attribute.label}
            </Option>
          ))}
          {(hasMore || loading) && (
            <div className={classes.loadMoreContainer}>
              {hasMore && !loading && (
                <Button color="primary" onClick={onFetchMore}>
                  <FormattedMessage id="ZDJEat" defaultMessage="Load More" description="button" />
                </Button>
              )}
              {loading && <SaleorThrobber size={32} />}
            </div>
          )}
        </Accordion>
        <FieldAccordion
          className={classes.accordion}
          title={intl.formatMessage({
            id: "jj3Cb8",
            defaultMessage: "Financial Information",
            description: "informations about product prices etc, header",
          })}
          data={data}
          fields={[ProductFieldEnum.CHARGE_TAXES]}
          onChange={handleFieldChange}
          onToggleAll={handleToggleAllFields}
          data-test-id="financial"
        />
        <Accordion
          className={classes.accordion}
          title={intl.formatMessage({
            id: "xjpTLF",
            defaultMessage: "Inventory Information",
            description: "informations about product stock, header",
          })}
          quickPeek={
            (data.exportInfo.warehouses.length > 0 || selectedInventoryFields.length > 0) && (
              <div className={classes.quickPeekContainer}>
                {selectedInventoryFields.slice(0, maxChips).map(field => (
                  <Chip
                    key={field}
                    className={classes.chip}
                    label={getFieldLabel(field)}
                    onClose={() =>
                      onChange({
                        target: {
                          name: field,
                          value: false,
                        },
                      })
                    }
                  />
                ))}
                {data.exportInfo.warehouses
                  .slice(0, maxChips - selectedInventoryFields.length)
                  .map(warehouseId => (
                    <Chip
                      key={warehouseId}
                      className={classes.chip}
                      label={warehouses.find(warehouse => warehouse.value === warehouseId).label}
                      onClose={() =>
                        onWarehouseSelect({
                          target: {
                            name: warehouseNamePrefix + warehouseId,
                            value: undefined,
                          },
                        })
                      }
                    />
                  ))}
                {data.exportInfo.warehouses.length + selectedInventoryFields.length > maxChips && (
                  <Text className={classes.moreLabel} size={2} fontWeight="light">
                    <FormattedMessage
                      id="ve/Sph"
                      defaultMessage="and {number} more"
                      description="there are more elements of list that are hidden"
                      values={{
                        number:
                          data.exportInfo.warehouses.length +
                          selectedInventoryFields.length -
                          maxChips,
                      }}
                    />
                  </Text>
                )}
              </div>
            )
          }
          data-test-id="inventory"
        >
          <div>
            <Option
              checked={selectedAllInventoryFields}
              name="all"
              onChange={() => handleToggleAllFields(inventoryFields, !selectedAllInventoryFields)}
            >
              <FormattedMessage
                id="lQRnYK"
                defaultMessage="Select All"
                description="selectt all options"
              />
            </Option>
            {inventoryFields.map(field => (
              <Option
                checked={data.exportInfo.fields.includes(field)}
                name={field}
                onChange={handleFieldChange}
                key={field}
              >
                {getFieldLabel(field)}
              </Option>
            ))}
          </div>
          <Hr className={classes.hrWarehouses} />
          <Text>
            <FormattedMessage id="ZRz3hM" defaultMessage="Export Product Stock Quantity to CSV" />
          </Text>
          <div>
            <Option
              checked={warehouses.every(warehouse =>
                data.exportInfo.warehouses.includes(warehouse.value),
              )}
              name="all-warehouses"
              onChange={onSelectAllWarehouses}
            >
              <FormattedMessage
                id="JGm7E5"
                defaultMessage="Export stock for all warehouses"
                description="option"
              />
            </Option>
          </div>
          <Hr className={classes.hrWarehouses} />
          <Text className={classes.warehousesLabel} fontSize={3}>
            <FormattedMessage
              id="WQMTKI"
              defaultMessage="Warehouses A to Z"
              description="list of warehouses"
            />
          </Text>
          {warehouses.map(warehouse => (
            <Option
              checked={data.exportInfo.warehouses.includes(warehouse.value)}
              name={warehouseNamePrefix + warehouse.value}
              onChange={onWarehouseSelect}
              key={warehouse.value}
            >
              {warehouse.label}
            </Option>
          ))}
        </Accordion>
        <FieldAccordion
          title={intl.formatMessage({
            id: "6xC/Ls",
            defaultMessage: "SEO Information",
            description: "informations about product seo, header",
          })}
          data={data}
          fields={[
            ProductFieldEnum.DESCRIPTION,
            ProductFieldEnum.NAME,
            ProductFieldEnum.PRODUCT_MEDIA,
            ProductFieldEnum.VARIANT_MEDIA,
          ]}
          onChange={handleFieldChange}
          onToggleAll={handleToggleAllFields}
          data-test-id="seo"
        />
      </div>
    </>
  );
};

ProductExportDialogInfo.displayName = "ProductExportDialogInfo";
export default ProductExportDialogInfo;
