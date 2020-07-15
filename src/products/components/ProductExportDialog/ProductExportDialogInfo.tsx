import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Accordion, { AccordionProps } from "@saleor/components/Accordion";
import Hr from "@saleor/components/Hr";
import { ChangeEvent } from "@saleor/hooks/useForm";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { sectionNames } from "@saleor/intl";
import { SearchAttributes_search_edges_node } from "@saleor/searches/types/SearchAttributes";
import { FetchMoreProps } from "@saleor/types";
import {
  ExportProductsInput,
  ProductFieldEnum
} from "@saleor/types/globalTypes";
import { toggle } from "@saleor/utils/lists";
import React from "react";
import { useIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

const attributeNamePrefix = "attribute-";

const useStyles = makeStyles(
  theme => ({
    accordion: {
      marginBottom: theme.spacing(2)
    },
    checkbox: {
      position: "relative",
      right: -theme.spacing(1.5)
    },
    dialogLabel: {
      marginBottom: theme.spacing(2)
    },
    hr: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3)
    },
    label: {
      "&&": {
        overflow: "visible"
      },
      justifyContent: "space-between",
      margin: theme.spacing(0),
      width: "100%"
    },
    loadMoreContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(2)
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
      color="primary"
      control={
        <Checkbox
          className={classes.checkbox}
          checked={checked}
          color="primary"
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
}> = ({ data, fields, onChange, ...props }) => {
  const intl = useIntl();

  const fieldNames: Record<ProductFieldEnum, string> = {
    [ProductFieldEnum.CATEGORY]: intl.formatMessage({
      defaultMessage: "Category",
      description: "product field"
    }),
    [ProductFieldEnum.CHARGE_TAXES]: intl.formatMessage({
      defaultMessage: "Charge Taxes",
      description: "product field"
    }),
    [ProductFieldEnum.COLLECTIONS]: intl.formatMessage({
      defaultMessage: "Collections",
      description: "product field"
    }),
    [ProductFieldEnum.COST_PRICE]: intl.formatMessage({
      defaultMessage: "Cost Price",
      description: "product field"
    }),
    [ProductFieldEnum.DESCRIPTION]: intl.formatMessage({
      defaultMessage: "Description",
      description: "product field"
    }),
    [ProductFieldEnum.NAME]: intl.formatMessage({
      defaultMessage: "Name",
      description: "product field"
    }),
    [ProductFieldEnum.PRODUCT_IMAGES]: intl.formatMessage({
      defaultMessage: "Product Images",
      description: "product field"
    }),
    [ProductFieldEnum.PRODUCT_TYPE]: intl.formatMessage({
      defaultMessage: "Type",
      description: "product field"
    }),
    [ProductFieldEnum.PRODUCT_WEIGHT]: intl.formatMessage({
      defaultMessage: "Weight",
      description: "product field"
    }),
    [ProductFieldEnum.VARIANT_IMAGES]: intl.formatMessage({
      defaultMessage: "Variant Images",
      description: "product field"
    }),
    [ProductFieldEnum.VARIANT_PRICE]: intl.formatMessage({
      defaultMessage: "Variant Price",
      description: "product field"
    }),
    [ProductFieldEnum.VARIANT_SKU]: intl.formatMessage({
      defaultMessage: "SKU",
      description: "product field"
    }),
    [ProductFieldEnum.VARIANT_WEIGHT]: intl.formatMessage({
      defaultMessage: "Variant Weight",
      description: "product field"
    }),
    [ProductFieldEnum.VISIBLE]: intl.formatMessage({
      defaultMessage: "Visibility",
      description: "product field"
    })
  };

  return (
    <Accordion
      title={intl.formatMessage({
        defaultMessage: "SEO Information",
        description: "informations about product seo, header"
      })}
      {...props}
    >
      {fields.map(field => (
        <Option
          checked={data.exportInfo.fields.includes(field)}
          name={field}
          onChange={onChange}
          key={field}
        >
          {fieldNames[field]}
        </Option>
      ))}
    </Accordion>
  );
};

export interface ProductExportDialogInfoProps extends FetchMoreProps {
  attributes: SearchAttributes_search_edges_node[];
  data: ExportProductsInput;
  onChange: (event: ChangeEvent) => void;
  onFetch: (query: string) => void;
}

const ProductExportDialogInfo: React.FC<ProductExportDialogInfoProps> = ({
  attributes,
  data,
  hasMore,
  loading,
  onChange,
  onFetch,
  onFetchMore
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);

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

  const handleAtrtibuteChange = (event: ChangeEvent) =>
    onChange({
      target: {
        name: "exportInfo",
        value: {
          ...data.exportInfo,
          attributes: toggle(
            event.target.name.substr(attributeNamePrefix.length),
            data.exportInfo.attributes,
            (a, b) => a === b
          )
        }
      }
    });

  return (
    <>
      <Typography className={classes.dialogLabel}>
        <FormattedMessage
          defaultMessage="Information exported:"
          description="select product informations to be exported"
        />
      </Typography>
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
      />
      <Accordion
        className={classes.accordion}
        title={intl.formatMessage(sectionNames.attributes)}
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
            checked={data.exportInfo.attributes.includes(attribute.id)}
            name={attributeNamePrefix + attribute.id}
            onChange={handleAtrtibuteChange}
            key={attribute.id}
          >
            {attribute.name}
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
        fields={[
          ProductFieldEnum.CHARGE_TAXES,
          ProductFieldEnum.COST_PRICE,
          ProductFieldEnum.VARIANT_PRICE,
          ProductFieldEnum.VISIBLE
        ]}
        onChange={handleFieldChange}
      />
      <FieldAccordion
        className={classes.accordion}
        title={intl.formatMessage({
          defaultMessage: "Inventory Information",
          description: "informations about product stock, header"
        })}
        data={data}
        fields={[
          ProductFieldEnum.PRODUCT_WEIGHT,
          ProductFieldEnum.VARIANT_SKU,
          ProductFieldEnum.VARIANT_WEIGHT
        ]}
        onChange={handleFieldChange}
      />
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
      />
    </>
  );
};

ProductExportDialogInfo.displayName = "ProductExportDialogInfo";
export default ProductExportDialogInfo;
