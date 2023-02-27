import { Card, CardContent } from "@material-ui/core";
import React from "react";

const CardDecorator = storyFn => (
  <Card
    style={{
      margin: "auto",
      overflow: "visible",
      position: "relative",
      width: 400,
    }}
  >
    <CardContent>{storyFn()}</CardContent>
  </Card>
);
export default CardDecorator;
