import useForm from "@saleor/hooks/useForm";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { props } from "./fixtures";
import Metadata from "./Metadata";

const Component = () => {
  const { change, data } = useForm(props.data, jest.fn());

  return (
    <Wrapper>
      <Metadata data={data} onChange={change} />
    </Wrapper>
  );
};

const getFirstExpandIcon = () => screen.getAllByTestId("expand")[0];

describe("Metadata editor", () => {
  it("can expand field", async () => {
    render(<Component />);
    const user = userEvent.setup();

    const isExpandedAttribute = "data-test-expanded";
    const editor = screen.getAllByTestId("metadata-editor")[0];

    expect(editor).toHaveAttribute(isExpandedAttribute, "false");

    await user.click(getFirstExpandIcon());

    expect(editor).toHaveAttribute(isExpandedAttribute, "true");
  });

  it("can edit field name", async () => {
    render(<Component />);
    const user = userEvent.setup();

    await user.click(getFirstExpandIcon());
    const input = screen.getByRole("textbox", {
      name: /name:0/i,
    });

    expect(input).toHaveValue(props.data.metadata[0].key);
    await user.type(input, " with new name");
    expect(input).toHaveValue("key with new name");
  });

  it("can edit field value", async () => {
    render(<Component />);
    const user = userEvent.setup();

    await user.click(getFirstExpandIcon());
    const input = screen.getByRole("textbox", { name: /value:0/i });

    expect(input).toHaveValue(props.data.metadata[0].value);
    await user.type(input, " with new field value");
    expect(input).toHaveValue("value with new field value");
  });

  it("can delete field", async () => {
    render(<Component />);
    const user = userEvent.setup();

    await user.click(getFirstExpandIcon());
    expect(screen.getAllByTestId("field")).toHaveLength(
      props.data.metadata.length,
    );

    await user.click(screen.getByTestId("delete-field-0"));
    expect(screen.getAllByTestId("field")).toHaveLength(
      props.data.metadata.length - 1,
    );
  });

  it("can add field", async () => {
    render(<Component />);
    const user = userEvent.setup();

    await user.click(getFirstExpandIcon());
    expect(screen.getAllByTestId("field")).toHaveLength(
      props.data.metadata.length,
    );

    await user.click(screen.getAllByTestId("add-field")[0]);
    expect(screen.getAllByTestId("field")).toHaveLength(
      props.data.metadata.length + 1,
    );
  });
});
