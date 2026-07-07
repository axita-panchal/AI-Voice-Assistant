import { forwardRef } from "react";
import CustomTextField from "./CustomTextField";
import { MenuItem } from "@mui/material";

interface OptionsTypes {
  label: string;
  value: string;
  disabled?: boolean;
}

export const CustomFormSelect = forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof CustomTextField>, "error"> & {
    label: string;
    error?: string;
    options: OptionsTypes[];
    placeholder?: string;
  }
>(
  (
    {
      label,
      error,
      options,
      placeholder = "Choose an option...",
      defaultValue = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          {label}
        </label>

        <CustomTextField
          ref={ref}
          select
          fullWidth
          size="small"
          error={!!error}
          helperText={error}
          defaultValue={defaultValue}
          SelectProps={{
            displayEmpty: true,
            renderValue: (selected: unknown) => {
              if (!selected) {
                return <span className="text-gray-400">{placeholder}</span>;
              }

              const selectedOption = options.find(
                (option) => option.value === selected,
              );

              return selectedOption?.label || "";
            },
          }}
          {...props}
        >
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>

          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </CustomTextField>
      </div>
    );
  },
);

CustomFormSelect.displayName = "CustomFormSelect";
