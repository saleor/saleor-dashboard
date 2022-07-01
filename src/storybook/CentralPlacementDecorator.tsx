import React from "react";

const CentralPlacementDecorator = storyFn => (
  <div
    style={{
      margin: "auto",
      overflow: "visible",
      minHeight: 800,
      width: 400,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {storyFn()}
  </div>
);
export default CentralPlacementDecorator;
