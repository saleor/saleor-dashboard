import { Card, CardContent } from "@material-ui/core";
import { Decorator } from "@storybook/react";
import React from "react";

export const CardDecorator: Decorator = Story => (
  <Card
    style={{
      margin: "auto",
      overflow: "visible",
      position: "relative",
      width: 400,
    }}
  >
    <CardContent>
      <Story />
    </CardContent>
  </Card>
);
