import { DashboardCard } from "@dashboard/components/Card";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface ProductTypeShippingProps {
  data: {
    isShippingRequired: boolean;
    weight: number | null;
  };
  weightUnit: string;
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
}

const ProductTypeShipping = ({
  data,
  weightUnit,
  disabled,
  onChange,
}: ProductTypeShippingProps) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "/2OOMe",
            defaultMessage: "Shipping",
            description: "product type shipping settings, section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Checkbox
          checked={data.isShippingRequired}
          disabled={disabled}
          name="isShippingRequired"
          data-test-id="isShippingRequired"
          onCheckedChange={checked =>
            onChange({
              target: { name: "isShippingRequired", value: checked },
            })
          }
          marginBottom={2}
        >
          <Text>
            <FormattedMessage
              id="IBw72y"
              defaultMessage="Is this product shippable?"
              description="switch button"
            />
          </Text>
        </Checkbox>
        {data.isShippingRequired && (
          <Input
            disabled={disabled}
            endAdornment={<Text color="default2">{weightUnit}</Text>}
            label={intl.formatMessage({
              id: "zCb8fX",
              defaultMessage: "Weight",
            })}
            name="weight"
            helperText={intl.formatMessage({
              id: "VOiUXQ",
              defaultMessage:
                "Used to calculate rates for shipping for products of this product type, when specific weight is not given",
            })}
            type="number"
            value={data.weight || 0}
            onChange={onChange}
          />
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeShipping.displayName = "ProductTypeShipping";
export default ProductTypeShipping;
