// src/components/ColorSelect.tsx

import Select, { StylesConfig } from "react-select";
import chroma from "chroma-js";

interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
}

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

const colourStyles: StylesConfig<ColourOption, true> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "hsl(var(--background))",
    borderColor: "hsl(var(--border))",
    height: '2rem', // Ajuste para h-8
    minHeight: '2rem', // Garantir altura mínima para h-8
    "&:hover": {
      borderColor: "hsl(var(--primary))",
    },
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? color.alpha(0.8).css()
        : isFocused
        ? color.alpha(0.7).css()
        : "hsl(var(--card))",
      color: isDisabled
        ? "hsl(var(--muted-foreground))"
        : isSelected || isFocused
        ? chroma.contrast(color, "black") > 2
          ? color.darken(3).css()
          : color.brighten(3).css()
        : color.css(),
      cursor: isDisabled ? "not-allowed" : "default",
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? color.css()
            : color.alpha(0.8).css()
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
  menuPortal: (styles) => ({ ...styles, zIndex: 9999 }),
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
      placeholder="Cores"
      menuPortalTarget={document.body}
      onChange={(selectedOptions) =>
        onChange(selectedOptions.map((option) => option.value).join(", "))
      }
    />
  );
};

export default ColorSelect;
