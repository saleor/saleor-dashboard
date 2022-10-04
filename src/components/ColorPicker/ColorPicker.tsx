import { TextField } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { UseFormResult } from "@saleor/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import { RequireOnlyOne } from "@saleor/misc";
import commonErrorMessages from "@saleor/utils/errors/common";
import Hue from "@uiw/react-color-hue";
import Saturation from "@uiw/react-color-saturation";
import convert from "color-convert";
import { RGB } from "color-convert/conversions";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    picker: {
      display: "flex",
    },

    saturation: {
      width: "220px !important",
      height: "220px !important",
    },

    colorInput: {
      whiteSpace: "nowrap",
      width: "170px",
      marginBottom: theme.spacing(1),

      "& input": {
        textAlign: "right",
        padding: "15px",
      },
    },
  }),
  { name: "ColorPicker" },
);

export type ColorPickerProps<T = any> = Pick<
  UseFormResult<T>,
  "setError" | "errors" | "clearErrors" | "data"
> & { onColorChange: (hex: string) => void };

export const ColorPicker: React.FC<ColorPickerProps> = ({
  clearErrors,
  setError,
  errors,
  onColorChange,
  data,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const [hex, setHex] = useState<string>(
    data.value ? data.value.replace("#", "") : "000000",
  );
  const [hue, setHue] = useState<number>(convert.hex.hsv(hex)[0]);

  const [, s, v] = convert.hex.hsv(hex);
  const [r, g, b] = convert.hex.rgb(hex);
  const isValidColor = hex.match(/^(?:[0-9a-fA-F]{3}){1,2}$/);

  const handleRGBChange = (
    rgbColor: RequireOnlyOne<{ r: string; g: string; b: string }>,
  ) => {
    const getValue = (val: string): number => {
      if (!val) {
        return 0;
      }
      const parsedVal = parseInt(val, 10);
      return parsedVal > 255 ? 255 : parsedVal;
    };

    setHex(
      convert.rgb.hex([
        getValue(rgbColor.r),
        getValue(rgbColor.g),
        getValue(rgbColor.b),
      ] as RGB),
    );
  };

  const handleHEXChange = (hexColor: string) =>
    setHex(hexColor.replace(/ |#/g, ""));

  useEffect(() => {
    if (isValidColor) {
      if ("value" in errors) {
        clearErrors("value");
      }

      onColorChange(`#${hex}`);
    } else {
      if (!("value" in errors)) {
        setError("value", intl.formatMessage(commonErrorMessages.invalid));
      }
    }
  }, [errors, hex]);

  return (
    <div className={classes.picker}>
      <div>
        <Saturation
          hsva={{ h: hue, s, v, a: 1 }}
          onChange={({ h, s, v }) => setHex(convert.hsv.hex([h, s, v]))}
          className={classes.saturation}
        />
      </div>
      <HorizontalSpacer spacing={4} />
      <div>
        <Hue
          hue={hue}
          onChange={({ h }) => {
            setHue(h);
            setHex(convert.hsv.hex([h, s, v]));
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
          value={r}
          onChange={event => handleRGBChange({ r: event.target.value })}
        />
        <TextField
          className={classes.colorInput}
          InputProps={{ startAdornment: "G" }}
          value={g}
          onChange={event => handleRGBChange({ g: event.target.value })}
        />
        <TextField
          className={classes.colorInput}
          InputProps={{ startAdornment: "B" }}
          value={b}
          onChange={event => handleRGBChange({ b: event.target.value })}
        />
        <TextField
          error={!isValidColor}
          helperText={errors?.value}
          className={classes.colorInput}
          InputProps={{ startAdornment: "HEX" }}
          inputProps={{ pattern: "[A-Za-z0-9]{6}", maxLength: 7 }}
          value={`#${hex}`}
          onChange={event => handleHEXChange(event.target.value)}
        />
      </div>
    </div>
  );
};
