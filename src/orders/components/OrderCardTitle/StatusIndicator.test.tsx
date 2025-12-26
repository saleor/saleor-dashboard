import { FulfillmentStatus } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { StatusIndicator } from "./StatusIndicator";

describe("StatusIndicator", () => {
  describe("when status is undefined", () => {
    it("does not render any indicator", () => {
      // Arrange & Act
      render(
        <Wrapper>
          <StatusIndicator status={undefined} />
        </Wrapper>,
      );

      // Assert
      expect(
        screen.queryByRole("generic", {
          name: /fulfilled|refunded|returned|canceled|replaced|waiting/i,
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe("when status is unfulfilled", () => {
    it("does not render any indicator", () => {
      // Arrange & Act
      render(
        <Wrapper>
          <StatusIndicator status="unfulfilled" />
        </Wrapper>,
      );

      // Assert
      expect(
        screen.queryByRole("generic", {
          name: /fulfilled|refunded|returned|canceled|replaced|waiting/i,
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe("when status is FULFILLED", () => {
    it("renders icon with fulfilled aria-label", () => {
      // Arrange & Act
      render(
        <Wrapper>
          <StatusIndicator status={FulfillmentStatus.FULFILLED} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByLabelText("Fulfilled")).toBeInTheDocument();
    });
  });

  describe("when status is REFUNDED", () => {
    it("renders icon with refunded aria-label", () => {
      // Arrange & Act
      render(
        <Wrapper>
          <StatusIndicator status={FulfillmentStatus.REFUNDED} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByLabelText("Refunded")).toBeInTheDocument();
    });
  });

  describe("when status is RETURNED", () => {
    it("renders icon with returned aria-label", () => {
      // Arrange & Act
      render(
        <Wrapper>
          <StatusIndicator status={FulfillmentStatus.RETURNED} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByLabelText("Returned")).toBeInTheDocument();
    });
  });

  describe("when status is CANCELED", () => {
    it("renders icon with canceled aria-label", () => {
      // Arrange & Act
      render(
        <Wrapper>
          <StatusIndicator status={FulfillmentStatus.CANCELED} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByLabelText("Canceled")).toBeInTheDocument();
    });
  });

  describe("when status is REPLACED", () => {
    it("renders icon with replaced aria-label", () => {
      // Arrange & Act
      render(
        <Wrapper>
          <StatusIndicator status={FulfillmentStatus.REPLACED} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByLabelText("Replaced")).toBeInTheDocument();
    });
  });

  describe("when status is WAITING_FOR_APPROVAL", () => {
    it("renders icon with waiting for approval aria-label", () => {
      // Arrange & Act
      render(
        <Wrapper>
          <StatusIndicator status={FulfillmentStatus.WAITING_FOR_APPROVAL} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByLabelText("Waiting for approval")).toBeInTheDocument();
    });
  });

  describe("when status is REFUNDED_AND_RETURNED", () => {
    it("renders icon with refunded and returned aria-label", () => {
      // Arrange & Act
      render(
        <Wrapper>
          <StatusIndicator status={FulfillmentStatus.REFUNDED_AND_RETURNED} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByLabelText("Refunded and Returned")).toBeInTheDocument();
    });
  });
});
