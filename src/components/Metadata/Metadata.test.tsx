import useForm from "@dashboard/hooks/useForm";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { props } from "./fixtures";
import { Metadata } from "./Metadata";

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
    // Arrange
    render(<Component />);

    const user = userEvent.setup();
    const isExpandedAttribute = "data-state";
    const editor = screen.getAllByTestId("metadata-item")[0];

    // Assert
    expect(editor).toHaveAttribute(isExpandedAttribute, "closed");
    // Act
    await user.click(getFirstExpandIcon());
    // Assert
    expect(editor).toHaveAttribute(isExpandedAttribute, "open");
  });
  xit("can edit field name", async () => {
    // Arrange
    render(<Component />);

    const user = userEvent.setup();

    // Act
    await user.click(getFirstExpandIcon());

    // Arrange
    const input = screen.getByRole("textbox", {
      name: /name:0/i,
    });

    // Assert
    expect(input).toHaveValue(props.data.metadata[0].key);
    // Act
    await user.type(input, " with new name");
    // Assert
    expect(input).toHaveValue("key with new name");
  });
  xit("can edit field value", async () => {
    // Arrange
    render(<Component />);

    const user = userEvent.setup();

    // Act
    await user.click(getFirstExpandIcon());

    // Arrange
    const input = screen.getByRole("textbox", { name: /value:0/i });

    // Assert
    expect(input).toHaveValue(props.data.metadata[0].value);
    // Act
    await user.type(input, " with new field value");
    // Assert
    expect(input).toHaveValue("value with new field value");
  });
  it("can delete field", async () => {
    // Arrange
    render(<Component />);

    const user = userEvent.setup();

    // Act
    await user.click(getFirstExpandIcon());
    // Assert
    expect(screen.getAllByTestId("field")).toHaveLength(props.data.metadata.length);
    // Act
    await user.click(screen.getByTestId("delete-field-0"));
    // Assert
    expect(screen.getAllByTestId("field")).toHaveLength(props.data.metadata.length - 1);
  });
  xit("can add field", async () => {
    // Arrange
    render(<Component />);

    const user = userEvent.setup();

    // Act
    await user.click(getFirstExpandIcon());
    // Assert
    expect(screen.getAllByTestId("field")).toHaveLength(props.data.metadata.length);
    // Act
    await user.click(screen.getAllByTestId("add-field")[0]);
    // Assert
    expect(screen.getAllByTestId("field")).toHaveLength(props.data.metadata.length + 1);
  });
});
