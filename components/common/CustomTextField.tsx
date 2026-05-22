"use client";

import React, { forwardRef } from "react";
import { TextField, TextFieldProps } from "@mui/material";

export type CustomTextFieldProps = TextFieldProps;

const CustomTextField = forwardRef<HTMLDivElement, CustomTextFieldProps>(
  ({ sx, size, multiline, ...props }, ref) => {
    const isSmall = size === "small";

    return (
      <TextField
        ref={ref}
        size={size}
        multiline={multiline}
        {...props}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: multiline ? "auto" : isSmall ? 44 : 64,
            borderRadius: isSmall ? "12px" : "20px",
            fontSize: isSmall ? "15px" : "16px",
            backgroundColor: "#fff",

            "& fieldset": {
              borderColor: props.error ? "#d32f2f" : "#D9D9D9",
            },

            "&:hover fieldset": {
              borderColor: props.error ? "#d32f2f" : "#D9D9D9",
            },

            "&.Mui-focused fieldset": {
              borderColor: props.error ? "#d32f2f" : "#3366FF",
              borderWidth: "1px",
            },
          },

          "& .MuiInputBase-input": {
            px: isSmall ? "14px" : "20px",
            py: multiline ? undefined : isSmall ? "10px" : "18px",
            color: "#4A4A4A",

            "&::placeholder": {
              color: "#9B9B9B",
              opacity: 1,
            },
          },
          // styling for standard MUI select when using select prop
          "& .MuiSelect-select": {
            padding: multiline ? undefined : isSmall ? "10px 14px" : "18px 20px",
          },
          ...sx,
        }}
      />
    );
  }
);

CustomTextField.displayName = "CustomTextField";

export default CustomTextField;
