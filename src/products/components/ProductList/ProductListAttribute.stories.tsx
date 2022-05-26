import { ProductListAttributeFragment } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductListAttribute from "./ProductListAttribute";

const attributes: ProductListAttributeFragment[] = [
  {
    __typename: "SelectedAttribute",
    attribute: {
      __typename: "Attribute",
      id: "1",
    },
    values: [
      {
        id: "QXR0cmlidXRlVmFsdWU6MTEz",
        name: "2022-03-11",
        slug: "72_37",
        file: null,
        reference: null,
        boolean: null,
        date: "2022-03-11",
        dateTime: null,
        value: "",
        __typename: "AttributeValue",
      },
    ],
  },
  {
    attribute: {
      id: "2",
      __typename: "Attribute",
    },
    values: [
      {
        id: "QXR0cmlidXRlVmFsdWU6MTE1",
        name: "2022-03-01 16:24:00+01:00",
        slug: "74_38",
        file: null,
        reference: null,
        boolean: null,
        date: null,
        dateTime: "2022-03-01T15:24:00+00:00",
        value: "",
        __typename: "AttributeValue",
      },
    ],
    __typename: "SelectedAttribute",
  },
  {
    attribute: {
      id: "3",
      __typename: "Attribute",
    },
    values: [
      {
        id: "QXR0cmlidXRlOjMw",
        name: "Lorem Ipsum",
        slug: "72_2",
        file: null,
        reference: "UGFnZToy",
        boolean: null,
        date: null,
        dateTime: null,
        value: "",
        __typename: "AttributeValue",
      },
      {
        id: "QXR0cmlidXRlOjMx",
        name: "Dolor Sit",
        slug: "72_3",
        file: null,
        reference: "UGFnZToz",
        boolean: null,
        date: null,
        dateTime: null,
        value: "",
        __typename: "AttributeValue",
      },
    ],
    __typename: "SelectedAttribute",
  },
];

storiesOf("Views / Products / Product list / Attribute display", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => (
    <ProductListAttribute
      attribute="attribute:3"
      productAttributes={attributes}
    />
  ))
  .add("date", () => (
    <ProductListAttribute
      attribute="attribute:1"
      productAttributes={attributes}
    />
  ))
  .add("datetime", () => (
    <ProductListAttribute
      attribute="attribute:2"
      productAttributes={attributes}
    />
  ));
