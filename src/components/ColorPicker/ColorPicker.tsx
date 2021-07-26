import Hue from "@uiw/react-color-hue";
import Saturation from "@uiw/react-color-saturation";
import React, { useState } from "react";

export const ColorPicker: React.FC = () => {
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });

  return (
    <>
      {/* <AlphaPicker />*/}
      {/* <BlockPicker />*/}
      {/* <ChromePicker />*/}
      {/* <CirclePicker />*/}
      {/* <CompactPicker />*/}
      {/* <GithubPicker />*/}
      {/* <HuePicker />*/}
      {/* <MaterialPicker />*/}
      {/* <PhotoshopPicker />*/}
      <Saturation
        hsva={hsva}
        onChange={newColor => {
          setHsva({ ...hsva, ...newColor, a: hsva.a });
        }}
      />
      <Hue
        hue={hsva.h}
        onChange={newHue => {
          setHsva({ ...hsva, ...newHue });
        }}
      />
      {/* <SliderPicker />*/}
      {/* <SwatchesPicker />*/}
      {/* <TwitterPicker />*/}
    </>
  );
};
