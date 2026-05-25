import { forwardRef } from "react";
import CustomTextField from "./CustomTextField";
import { MenuItem } from "@mui/material";

interface optionsTypes {
  label: string;
  value: string;
}


export const CustomFormSelect = forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof CustomTextField>, "error"> & {
    label: string;
    error?: string;
    options: optionsTypes[];
  }
>(({ label, error, options, ...props }, ref) => {
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
        {...props}
      >
        <MenuItem value="" disabled>
          Choose an option...
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </CustomTextField>
    </div>
  );
});

CustomFormSelect.displayName = "CustomFormSelect";