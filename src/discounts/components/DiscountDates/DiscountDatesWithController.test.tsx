import { getValidationSchema } from "@dashboard/discounts/components/DiscountCreateForm/validationSchema";
import { type DiscoutFormData } from "@dashboard/discounts/types";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { DiscountDatesWithController } from "./DiscountDatesWithController";

const form: DiscoutFormData = {
  type: PromotionTypeEnum.CATALOGUE,
  name: "Winter sale",
  description: "",
  dates: {
    startDate: "2030-12-20",
    startTime: "13:45",
    hasEndDate: false,
    endDate: "",
    endTime: "",
  },
  rules: [],
};

const PromotionDates = (): React.ReactNode => {
  const intl = useIntl();
  const methods = useForm<DiscoutFormData>({
    mode: "onBlur",
    values: form,
    resolver: zodResolver(getValidationSchema(intl)),
  });

  return (
    <FormProvider {...methods}>
      <DiscountDatesWithController errors={[]} />
    </FormProvider>
  );
};

describe("DiscountDatesWithController", () => {
  it("shows a partly typed hour as an error when the hour loses focus", async () => {
    // Arrange
    render(<PromotionDates />, { wrapper: Wrapper });

    const startHour = screen.getByTestId("start-hour-input");

    // jsdom has no partial time entry, so report it the way a browser does.
    fireEvent.change(startHour, { target: { value: "" } });
    Object.defineProperty(startHour, "validity", { value: { badInput: true } });

    // Act
    fireEvent.blur(startHour);

    // Assert
    expect(await screen.findByText("Enter a complete time.")).toBeInTheDocument();
  });
});
