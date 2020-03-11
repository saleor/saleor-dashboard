import React from "react";

import { ProductErrorFragment } from "@saleor/attributes/types/ProductErrorFragment";

interface ProductTypeUpdateErrorsState {
  addAttributeErrors: ProductErrorFragment[];
  editAttributeErrors: ProductErrorFragment[];
  formErrors: ProductErrorFragment[];
}
interface ProductTypeUpdateErrorsProps {
  children: (props: {
    errors: ProductTypeUpdateErrorsState;
    set: {
      addAttributeErrors: (errors: ProductErrorFragment[]) => void;
      editAttributeErrors: (errors: ProductErrorFragment[]) => void;
      formErrors: (errors: ProductErrorFragment[]) => void;
    };
  }) => React.ReactNode;
}

export class ProductTypeUpdateErrors extends React.Component<
  ProductTypeUpdateErrorsProps,
  ProductTypeUpdateErrorsState
> {
  state: ProductTypeUpdateErrorsState = {
    addAttributeErrors: [],
    editAttributeErrors: [],
    formErrors: []
  };

  render() {
    return this.props.children({
      errors: this.state,
      set: {
        addAttributeErrors: (addAttributeErrors: ProductErrorFragment[]) =>
          this.setState({ addAttributeErrors }),
        editAttributeErrors: (editAttributeErrors: ProductErrorFragment[]) =>
          this.setState({ editAttributeErrors }),
        formErrors: (formErrors: ProductErrorFragment[]) =>
          this.setState({ formErrors })
      }
    });
  }
}
export default ProductTypeUpdateErrors;
