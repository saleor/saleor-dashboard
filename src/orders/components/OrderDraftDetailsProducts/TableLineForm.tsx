import { TextField } from "@material-ui/core";
import DebounceForm from "@saleor/components/DebounceForm";
import Form from "@saleor/components/Form";
import { OrderLineFragment, OrderLineInput } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import createNonNegativeValueChangeHandler from "@saleor/utils/handlers/nonNegativeValueChangeHandler";
import React from "react";

const useStyles = makeStyles(
  () => ({
    quantityField: {
      "& input": {
        padding: "12px 12px 10px",
        textAlign: "right",
      },
      width: 100,
    },
  }),
  { name: "TableLineForm" },
);
interface TableLineFormProps {
  line: OrderLineFragment;
  onOrderLineChange: (id: string, data: OrderLineInput) => void;
}

const TableLineForm: React.FC<TableLineFormProps> = ({
  line,
  onOrderLineChange,
}) => {
  const classes = useStyles({});
  const { id, quantity } = line;

  const handleSubmit = (id: string, data: OrderLineInput) => {
    if (!data || data.quantity < 1) {
      return;
    }
    onOrderLineChange(id, { quantity: Math.floor(data.quantity) });
  };

  return (
    <Form initial={{ quantity }} onSubmit={data => handleSubmit(id, data)}>
      {({ change, data, submit }) => {
        const handleQuantityChange = createNonNegativeValueChangeHandler(
          change,
        );

        return (
          <DebounceForm
            change={handleQuantityChange}
            submit={submit}
            time={200}
          >
            {debounce => (
              <TextField
                className={classes.quantityField}
                fullWidth
                name="quantity"
                type="number"
                value={data.quantity}
                onChange={debounce}
                onBlur={submit}
                inputProps={{
                  min: 1,
                }}
              />
            )}
          </DebounceForm>
        );
      }}
    </Form>
  );
};

export default TableLineForm;
