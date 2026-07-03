import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { ConditionalFilterContext } from "@dashboard/components/ConditionalFilter/context/context";
import { DashboardModal } from "@dashboard/components/Modal";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import styles from "./DashboardModal.module.css";
import { getLayoutChildren, getLayoutWrapper } from "./getLayoutChildren";
import { MODAL_ACTIONS_DISPLAY_NAME, MODAL_BODY_DISPLAY_NAME } from "./modalDisplayNames";

const mockFilterContext = {
  apiProvider: {},
  valueProvider: { count: 0 },
  leftOperandsProvider: {},
  containerState: { clearEmpty: () => undefined },
  filterWindow: { isOpen: false, setOpen: () => undefined },
  queryApiType: "where",
} as unknown as React.ContextType<typeof ConditionalFilterContext>;

const PickerHeader = () => <div data-test-id="picker-header" />;
const Body = () => <div data-test-id="body" />;
const Actions = () => <div data-test-id="actions" />;

PickerHeader.displayName = "DashboardModal.PickerHeader";
Body.displayName = MODAL_BODY_DISPLAY_NAME;
Actions.displayName = MODAL_ACTIONS_DISPLAY_NAME;

const FilterProvider = ({ children }: { children: React.ReactNode }) => (
  <ConditionalFilterContext.Provider value={mockFilterContext}>
    {children}
  </ConditionalFilterContext.Provider>
);

describe("getLayoutChildren", () => {
  it("unwraps fragments that contain modal layout parts", () => {
    // Arrange
    const children = (
      <>
        <PickerHeader />
        <Body />
        <Actions />
      </>
    );

    // Act
    const items = getLayoutChildren(children);

    // Assert
    expect(items).toHaveLength(3);
  });

  it("unwraps providers when they only wrap modal layout parts", () => {
    // Arrange
    const children = (
      <FilterProvider>
        <>
          <PickerHeader />
          <Body />
          <Actions />
        </>
      </FilterProvider>
    );

    // Act
    const items = getLayoutChildren(children);

    // Assert
    expect(items).toHaveLength(3);
  });

  it("does not unwrap opaque component wrappers", () => {
    // Arrange
    const Wrapper = () => (
      <>
        <PickerHeader />
        <Body />
        <Actions />
      </>
    );
    const children = (
      <FilterProvider>
        <Wrapper />
      </FilterProvider>
    );

    // Act
    const items = getLayoutChildren(children);

    // Assert
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(expect.objectContaining({ type: FilterProvider }));
  });

  it("lets Content pin actions for picker dialogs wrapped in providers", () => {
    // Arrange
    const FilterConsumer = () => {
      useConditionalFilterContext();

      return null;
    };

    render(
      <DashboardModal open onChange={() => undefined}>
        <DashboardModal.Content size="picker">
          <FilterProvider>
            <>
              <DashboardModal.PickerHeader toolbar={<FilterConsumer />}>
                Assign products
              </DashboardModal.PickerHeader>
              <DashboardModal.Body>List</DashboardModal.Body>
              <DashboardModal.Actions>
                <button type="button">Back</button>
              </DashboardModal.Actions>
            </>
          </FilterProvider>
        </DashboardModal.Content>
      </DashboardModal>,
    );

    // Assert
    expect(document.querySelector(`.${styles.scrollBody}`)).toBeNull();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("detects layout wrappers that only contain modal layout parts", () => {
    // Arrange
    const children = (
      <FilterProvider>
        <>
          <PickerHeader />
          <Body />
          <Actions />
        </>
      </FilterProvider>
    );

    // Act
    const wrapper = getLayoutWrapper(children);

    // Assert
    expect(wrapper).not.toBeNull();
    expect(getLayoutWrapper(<PickerHeader />)).toBeNull();
  });

  it("renders form modal with header divider and inset body padding", () => {
    // Arrange
    render(
      <DashboardModal open onChange={() => undefined}>
        <DashboardModal.Content size="xs">
          <DashboardModal.Header>Enter Voucher Code</DashboardModal.Header>
          <DashboardModal.Body>
            <DashboardModal.Inset>
              <input data-test-id="form-input" />
            </DashboardModal.Inset>
          </DashboardModal.Body>
          <DashboardModal.Actions>
            <button type="button">Confirm</button>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>,
      { wrapper: Wrapper },
    );

    const divider = document.querySelector(`.${styles.fullBleedDivider}`);
    const inset = screen.getByTestId("form-input").parentElement;

    // Assert
    expect(divider).toBeInTheDocument();
    expect(document.querySelector(`.${styles.contentShellHeaderOnly}`)).not.toBeInTheDocument();
    expect(inset).toContainElement(screen.getByTestId("form-input"));
  });

  it("applies header-only layout class for confirmation dialogs", () => {
    // Arrange
    render(
      <DashboardModal open onChange={() => undefined}>
        <DashboardModal.Content size="sm">
          <DashboardModal.Header>Leave without saving changes?</DashboardModal.Header>
          <DashboardModal.Actions>
            <button type="button">Keep editing</button>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>,
    );

    // Assert
    expect(document.querySelector(`.${styles.contentShellHeaderOnly}`)).toBeInTheDocument();
  });
});
