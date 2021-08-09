import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField
} from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { makeStyles } from "@saleor/macaw-ui";
import { RequireOnlyOne } from "@saleor/misc";
import Hue from "@uiw/react-color-hue";
import Saturation from "@uiw/react-color-saturation";
import convert from "color-convert";
import React, { useState } from "react";

import RadioGroupField from "../RadioGroupField/RadioGroupField";

const useStyles = makeStyles(
  theme => ({
    picker: {
      display: "flex"
    },

    saturation: {
      width: "220px !important",
      height: "220px !important"
    },

    colorInput: {
      width: "170px",
      marginBottom: theme.spacing(1),

      "& input": {
        textAlign: "right",
        padding: "15px"
      }
    }
  }),
  { name: "ColorPicker" }
);

export const ColorPicker: React.FC = () => {
  const classes = useStyles();
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });

  const [r, g, b] = convert.hsv.rgb([hsva.h, hsva.s, hsva.v]);
  const hex = convert.hsv.hex([hsva.h, hsva.s, hsva.v]);

  const handleRGBChange = (
    rgbColor: RequireOnlyOne<{ r: number; g: number; b: number }>
  ) => {
    const [h, s, v] = convert.rgb.hsv([
      rgbColor.r ?? r,
      rgbColor.g ?? g,
      rgbColor.b ?? b
    ]);
    setHsva(hsva => ({ h, s, v, a: hsva.a }));
  };

  const handleHEXChange = (hexColor: string) => {
    const [h, s, v] = convert.hex.hsv(hexColor);
    setHsva(hsva => ({ h, s, v, a: hsva.a }));
  };

  return (
    <>
      <RadioGroupField
        choices={[
          { label: "Picker", value: "picker" },
          { label: "Image", value: "image" }
        ]}
        variant="inline"
        label="Swatch"
        name="swatch"
        value="picker"
        onChange={() => {}}
      />
      <div className={classes.picker}>
        <div>
          <Saturation
            hsva={hsva}
            onChange={newColor => {
              setHsva({ ...hsva, ...newColor, a: hsva.a });
            }}
            className={classes.saturation}
          />
        </div>
        <HorizontalSpacer spacing={4} />
        <div>
          <Hue
            hue={hsva.h}
            onChange={newHue => {
              setHsva({ ...hsva, ...newHue });
            }}
            direction="vertical"
            height="220px"
            width="16px"
          />
        </div>
        <HorizontalSpacer spacing={4} />
        <div>
          <TextField
            className={classes.colorInput}
            InputProps={{ startAdornment: "R" }}
            inputProps={{ pattern: "[0-9]{3}", maxLength: 3 }}
            value={r}
            onChange={evt =>
              handleRGBChange({ r: parseInt(evt.target.value, 10) })
            }
          />
          <TextField
            className={classes.colorInput}
            InputProps={{ startAdornment: "G" }}
            inputProps={{ pattern: "[0-9]{3}", maxLength: 3 }}
            value={g}
            onChange={evt =>
              handleRGBChange({ g: parseInt(evt.target.value, 10) })
            }
          />
          <TextField
            className={classes.colorInput}
            InputProps={{ startAdornment: "B" }}
            inputProps={{ pattern: "[0-9]{3}", maxLength: 3 }}
            value={b}
            onChange={evt =>
              handleRGBChange({ b: parseInt(evt.target.value, 10) })
            }
          />
          <TextField
            className={classes.colorInput}
            InputProps={{ startAdornment: "HEX" }}
            inputProps={{ pattern: "[A-Za-z0-9]{6}", maxLength: 6 }}
            value={hex}
            onChange={evt => handleHEXChange(evt.target.value)}
          />
        </div>
      </div>
    </>
  );
};
