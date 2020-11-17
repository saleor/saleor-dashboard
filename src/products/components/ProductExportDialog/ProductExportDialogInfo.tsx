import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Channels_channels } from "@saleor/channels/types/Channels";
import Accordion, { AccordionProps } from "@saleor/components/Accordion";
import ChannelsAvailabilityContent from "@saleor/components/ChannelsAvailabilityContent";
import Checkbox from "@saleor/components/Checkbox";
import Chip from "@saleor/components/Chip";
import Hr from "@saleor/components/Hr";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { sectionNames } from "@saleor/intl";
import { FetchMoreProps } from "@saleor/types";
import {
  ExportProductsInput,
  ProductFieldEnum
} from "@saleor/types/globalTypes";
import { toggle } from "@saleor/utils/lists";
import React from "react";
import { useIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

import useProductExportFieldMessages from "./messages";

export const attributeNamePrefix = "attribute-";
export const warehouseNamePrefix = "warehouse-";
const maxChips = 4;

const inventoryFields = [
  ProductFieldEnum.PRODUCT_WEIGHT,
  ProductFieldEnum.VARIANT_SKU,
  ProductFieldEnum.VARIANT_WEIGHT
];

const useStyles = makeStyles(
  theme => ({
    accordion: {
      marginBottom: theme.spacing(2)
    },
    checkbox: {
      position: "relative",
      right: -theme.spacing(1.5)
    },
    chip: {
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing()
    },
    dialogLabel: {
      marginBottom: theme.spacing(2)
    },
    hr: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3)
    },
    hrWarehouses: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(1)
    },
    label: {
      "&&": {
        overflow: "visible"
      },
      "&:first-of-type": {
        paddingTop: 0
      },
      "&:not(:last-of-type)": {
        borderBottom: `1px solid ${theme.palette.divider}`
      },
      justifyContent: "space-between",
      margin: theme.spacing(0),
      padding: theme.spacing(1, 0),
      width: "100%"
    },
    loadMoreContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(2)
    },
    moreLabel: {
      display: "inline-block",
      marginBottom: theme.spacing()
    },
    optionLabel: {
      fontSize: 14,
      marginLeft: 0
    },
    quickPeekContainer: {
      marginBottom: theme.spacing(-1)
    },
    warehousesLabel: {
      marginBottom: theme.spacing(2)
    }
  }),
  {
    name: "ProductExportDialogInfo"
  }
);

const Option: React.FC<{
  checked: boolean;
  name: string;
  onChange: (event: ChangeEvent) => void;
}> = ({ checked, children, name, onChange }) => {
  const classes = useStyles({});

  return (
    <FormControlLabel
      classes={{
        label: classes.optionLabel
      }}
      color="primary"
      control={
        <Checkbox
          className={classes.checkbox}
          checked={checked}
          name={name}
          onChange={onChange}
        />
      }
      className={classes.label}
      label={children}
      labelPlacement="start"
    ></FormControlLabel>
  );
};

const FieldAccordion: React.FC<AccordionProps & {
  data: ExportProductsInput;
  fields: ProductFieldEnum[];
  onChange: (event: ChangeEvent) => void;
  onToggleAll: (field: ProductFieldEnum[], setTo: boolean) => void;
}> = ({ data, fields, onChange, onToggleAll, ...props }) => {
  const classes = useStyles({});
  const getFieldLabel = useProductExportFieldMessages();

  const selectedAll = fields.every(field =>
    data.exportInfo.fields.includes(field)
  );

  const selectedFields = data.exportInfo.fields.filter(field =>
    fields.includes(field)
  );

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
                      value: false
                    }
                  })
                }
                key={field}
              />
            ))}
            {selectedFields.length > maxChips && (
              <Typography className={classes.moreLabel} variant="caption">
                <FormattedMessage
                  defaultMessage="and {number} more"
                  description="there are more elements of list that are hidden"
                  values={{
                    number: selectedFields.length - maxChips
                  }}
                />
              </Typography>
            )}
          </div>
        )
      }
      {...props}
    >
      <Option
        checked={selectedAll}
        name="all"
        onChange={() => onToggleAll(fields, !selectedAll)}
      >
        <FormattedMessage
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

export interface ProductExportDialogInfoProps extends FetchMoreProps {
  attributes: MultiAutocompleteChoiceType[];
  channels: Channels_channels[];
  selectedChannels: Channels_channels[];
  warehouses: MultiAutocompleteChoiceType[];
  data: ExportProductsInput;
  selectedAttributes: MultiAutocompleteChoiceType[];
  onAttrtibuteSelect: FormChange;
  onWarehouseSelect: FormChange;
  onChange: FormChange;
  onFetch: (query: string) => void;
  onSelectAllWarehouses: FormChange;
  onSelectAllChannels: (items: Channels_channels[], selected: number) => void;
  onChannelSelect: (option: Channels_channels) => void;
}

const ProductExportDialogInfo: React.FC<ProductExportDialogInfoProps> = ({
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
  onSelectAllWarehouses
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);
  const getFieldLabel = useProductExportFieldMessages();

  const handleFieldChange = (event: ChangeEvent) =>
    onChange({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          fields: toggle(
            event.target.name,
            data.exportInfo.fields,
            (a, b) => a === b
          )
        }
      }
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
                ...fields.filter(
                  field => !data.exportInfo.fields.includes(field)
                )
              ]
            : data.exportInfo.fields.filter(field => !fields.includes(field))
        }
      }
    });

  const selectedInventoryFields = data.exportInfo.fields.filter(field =>
    inventoryFields.includes(field)
  );
  const selectedAllInventoryFields =
    selectedInventoryFields.length === inventoryFields.length;

  return (
    <>
      <Typography className={classes.dialogLabel}>
        <FormattedMessage
          defaultMessage="Information exported:"
          description="select product informations to be exported"
        />
      </Typography>
      <Accordion
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
                <Typography className={classes.moreLabel} variant="caption">
                  <FormattedMessage
                    defaultMessage="and {number} more"
                    description="there are more elements of list that are hidden"
                    values={{
                      number: selectedChannels.length - maxChips
                    }}
                  />
                </Typography>
              )}
            </div>
          )
        }
        data-test="channels"
      >
        <ChannelsAvailabilityContent
          channels={channels}
          disabled={loading}
          selected={selectedChannels?.length}
          toggleAllText={intl.formatMessage({
            defaultMessage: "Add all channels"
          })}
          isSelected={option =>
            !!selectedChannels.find(channel => channel.id === option.id)
          }
          onChange={onChannelSelect}
          toggleAll={onSelectAllChannels}
        />
      </Accordion>
      <FieldAccordion
        className={classes.accordion}
        title={intl.formatMessage({
          defaultMessage: "Product Organization",
          description: "informations about product organization, header"
        })}
        data={data}
        fields={[
          ProductFieldEnum.CATEGORY,
          ProductFieldEnum.COLLECTIONS,
          ProductFieldEnum.PRODUCT_TYPE
        ]}
        onChange={handleFieldChange}
        onToggleAll={handleToggleAllFields}
        data-test="organization"
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
                        value: undefined
                      }
                    })
                  }
                  key={attribute.value}
                />
              ))}
              {selectedAttributes.length > maxChips && (
                <Typography className={classes.moreLabel} variant="caption">
                  <FormattedMessage
                    defaultMessage="and {number} more"
                    description="there are more elements of list that are hidden"
                    values={{
                      number: selectedAttributes.length - maxChips
                    }}
                  />
                </Typography>
              )}
            </div>
          )
        }
        data-test="attributes"
      >
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage({
            defaultMessage: "Search Atrtibuttes"
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Search by attribute name",
            description: "input helper text, search attributes"
          })}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />
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
                <FormattedMessage
                  defaultMessage="Load More"
                  description="button"
                />
              </Button>
            )}
            {loading && <CircularProgress size={32} />}
          </div>
        )}
      </Accordion>
      <FieldAccordion
        className={classes.accordion}
        title={intl.formatMessage({
          defaultMessage: "Financial Information",
          description: "informations about product prices etc, header"
        })}
        data={data}
        fields={[ProductFieldEnum.CHARGE_TAXES]}
        onChange={handleFieldChange}
        onToggleAll={handleToggleAllFields}
        data-test="financial"
      />
      <Accordion
        className={classes.accordion}
        title={intl.formatMessage({
          defaultMessage: "Inventory Information",
          description: "informations about product stock, header"
        })}
        quickPeek={
          (data.exportInfo.warehouses.length > 0 ||
            selectedInventoryFields.length > 0) && (
            <div className={classes.quickPeekContainer}>
              {selectedInventoryFields.slice(0, maxChips).map(field => (
                <Chip
                  className={classes.chip}
                  label={getFieldLabel(field)}
                  onClose={() =>
                    onChange({
                      target: {
                        name: field,
                        value: false
                      }
                    })
                  }
                />
              ))}
              {data.exportInfo.warehouses
                .slice(0, maxChips - selectedInventoryFields.length)
                .map(warehouseId => (
                  <Chip
                    className={classes.chip}
                    label={
                      warehouses.find(
                        warehouse => warehouse.value === warehouseId
                      ).label
                    }
                    onClose={() =>
                      onWarehouseSelect({
                        target: {
                          name: warehouseNamePrefix + warehouseId,
                          value: undefined
                        }
                      })
                    }
                  />
                ))}
              {data.exportInfo.warehouses.length +
                selectedInventoryFields.length >
                maxChips && (
                <Typography className={classes.moreLabel} variant="caption">
                  <FormattedMessage
                    defaultMessage="and {number} more"
                    description="there are more elements of list that are hidden"
                    values={{
                      number:
                        data.exportInfo.warehouses.length +
                        selectedInventoryFields.length -
                        maxChips
                    }}
                  />
                </Typography>
              )}
            </div>
          )
        }
        data-test="inventory"
      >
        <div>
          <Option
            checked={selectedAllInventoryFields}
            name="all"
            onChange={() =>
              handleToggleAllFields(
                inventoryFields,
                !selectedAllInventoryFields
              )
            }
          >
            <FormattedMessage
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
        <Typography>
          <FormattedMessage defaultMessage="Export Product Stock Quantity to CSV" />
        </Typography>
        <div>
          <Option
            checked={warehouses.every(warehouse =>
              data.exportInfo.warehouses.includes(warehouse.value)
            )}
            name="all-warehouses"
            onChange={onSelectAllWarehouses}
          >
            <FormattedMessage
              defaultMessage="Export stock for all warehouses"
              description="option"
            />
          </Option>
        </div>
        <Hr className={classes.hrWarehouses} />
        <Typography className={classes.warehousesLabel} variant="subtitle1">
          <FormattedMessage
            defaultMessage="Warehouses A to Z"
            description="list of warehouses"
          />
        </Typography>
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
          defaultMessage: "SEO Information",
          description: "informations about product seo, header"
        })}
        data={data}
        fields={[
          ProductFieldEnum.DESCRIPTION,
          ProductFieldEnum.NAME,
          ProductFieldEnum.PRODUCT_IMAGES,
          ProductFieldEnum.VARIANT_IMAGES
        ]}
        onChange={handleFieldChange}
        onToggleAll={handleToggleAllFields}
        data-test="seo"
      />
    </>
  );
};

ProductExportDialogInfo.displayName = "ProductExportDialogInfo";
export default ProductExportDialogInfo;
