// src/components/ColorSelect.tsx

import Select, { StylesConfig } from "react-select";
import chroma from "chroma-js";

// Define the type for color options
interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
}

// Expanded list of color options
const colourOptions: ColourOption[] = [
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "blue", label: "Blue", color: "#0065FF" },
  { value: "purple", label: "Purple", color: "#6554C0" },
  { value: "pink", label: "Pink", color: "#FF69B4" },
  { value: "brown", label: "Brown", color: "#8B4513" },
  { value: "black", label: "Black", color: "#000000" },
  { value: "white", label: "White", color: "#FFFFFF" },
  { value: "grey", label: "Grey", color: "#A9A9A9" },
  { value: "teal", label: "Teal", color: "#008080" },
  { value: "cyan", label: "Cyan", color: "#00FFFF" },
  { value: "magenta", label: "Magenta", color: "#FF00FF" },
  { value: "lime", label: "Lime", color: "#00FF00" },
  { value: "indigo", label: "Indigo", color: "#4B0082" },
];

// Styles for the color select component
const colourStyles: StylesConfig<ColourOption, true> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "hsl(var(--background))",
    borderColor: "hsl(var(--border))",
    "&:hover": {
      borderColor: "hsl(var(--primary))",
    },
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    const isWhite = data.color === "#FFFFFF";
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? color.css()
        : isFocused
        ? color.alpha(0.3).css() // Less transparent hover background
        : "hsl(var(--card))", // Darker background for dropdown options
      color: isDisabled
        ? "hsl(var(--muted-foreground))"
        : isSelected || isFocused
        ? isWhite
          ? "rgba(0, 0, 0, 0.9)" // Darker text for white background
          : chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : isWhite
        ? "rgba(0, 0, 0, 0.9)" // Darker text for white background
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? color.css()
            : color.alpha(0.4).css() // More visible active state
          : undefined,
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
  menuPortal: (styles) => ({ ...styles, zIndex: 9999 }), // Ensure the dropdown is above other components
};

interface ColorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ value, onChange }) => {
  return (
    <Select
      isMulti
      options={colourOptions}
      value={colourOptions.filter((option) =>
        value.split(", ").includes(option.value)
      )}
      styles={colourStyles}
      placeholder="Select Colors"
      menuPortalTarget={document.body} // Attach the dropdown to the body
      onChange={(selectedOptions) =>
        onChange(selectedOptions.map((option) => option.value).join(", "))
      }
    />
  );
};

export default ColorSelect;
