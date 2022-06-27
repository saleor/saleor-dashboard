import useForm from "@saleor/hooks/useForm";
import Wrapper from "@test/wrapper";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

import { props } from "./fixtures";
import Metadata from "./Metadata";

configure({ adapter: new Adapter() });

const expandButton = 'data-test-id="expand"';

const Component: React.FC = () => {
  const { change, data } = useForm(props.data, jest.fn());

  return (
    <Wrapper>
      <Metadata data={data} onChange={change} />
    </Wrapper>
  );
};

describe("Metadata editor", () => {
  it("can expand field", () => {
    const wrapper = mount(<Component />);

    const expandDataEl = "data-test-expanded";

    expect(
      wrapper
        .find(`[${expandDataEl}]`)
        .first()
        .prop(expandDataEl),
    ).toEqual(false);
    wrapper
      .find(`[${expandButton}]`)
      .first()
      .simulate("click");
    expect(
      wrapper
        .find(`[${expandDataEl}]`)
        .first()
        .prop(expandDataEl),
    ).toEqual(true);
  });

  it("can edit field name", () => {
    const wrapper = mount(<Component />);

    const inputNameSelector = '[name="name:1"] input';

    // Expand to reveal fields
    wrapper
      .find(`[${expandButton}]`)
      .first()
      .simulate("click");

    expect(
      wrapper
        .find(inputNameSelector)
        .first()
        .prop("value"),
    ).toEqual(props.data.metadata[1].key);

    wrapper
      .find(inputNameSelector)
      .first()
      .simulate("change", { target: { name: "name:1", value: "x" } });

    expect(
      wrapper
        .find(inputNameSelector)
        .first()
        .prop("value"),
    ).toEqual("x");
  });

  it("can edit field value", () => {
    const wrapper = mount(<Component />);

    const inputNameSelector = '[name="value:1"] textarea';

    // Expand to reveal fields
    wrapper
      .find(`[${expandButton}]`)
      .first()
      .simulate("click");

    expect(
      wrapper
        .find(inputNameSelector)
        .first()
        .prop("value"),
    ).toEqual(props.data.metadata[1].value);

    wrapper
      .find(inputNameSelector)
      .first()
      .simulate("change", { target: { name: "value:1", value: "x" } });

    expect(
      wrapper
        .find(inputNameSelector)
        .first()
        .prop("value"),
    ).toEqual("x");
  });

  it("can delete field", () => {
    const wrapper = mount(<Component />);

    const fieldSelector = 'tr[data-test-id="field"]';
    const deleteButtonSelector = '[data-test-id*="delete-field"]';

    // Expand to reveal fields
    wrapper
      .find(`[${expandButton}]`)
      .first()
      .simulate("click");

    expect(wrapper.find(fieldSelector).length).toEqual(
      props.data.metadata.length,
    );

    wrapper
      .find(deleteButtonSelector)
      .first()
      .simulate("click");

    expect(wrapper.find(fieldSelector).length).toEqual(
      props.data.metadata.length - 1,
    );
  });

  it("can add field", () => {
    const wrapper = mount(<Component />);

    const fieldSelector = 'tr[data-test-id="field"]';
    const addButtonSelector = '[data-test-id="add-field"]';

    // Expand to reveal fields
    wrapper
      .find(`[${expandButton}]`)
      .first()
      .simulate("click");

    expect(wrapper.find(fieldSelector).length).toEqual(
      props.data.metadata.length,
    );

    wrapper
      .find(addButtonSelector)
      .first()
      .simulate("click");

    expect(wrapper.find(fieldSelector).length).toEqual(
      props.data.metadata.length + 1,
    );
  });
});
