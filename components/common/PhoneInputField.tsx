"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  error?: string;
};

export default function PhoneInputField<T extends FieldValues>({
  control,
  name,
  error,
}: Props<T>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        Phone
      </label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: "Phone number is required",
          validate: (value) =>
            !value || isValidPhoneNumber(value)
              ? true
              : "Enter a valid phone number",
        }}
        render={({ field }) => (
          <PhoneInput
            {...field}
            international
            defaultCountry="IN"
            placeholder="Enter phone number"
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              field.onBlur();
            }}
            className={`
              rounded-md border px-3 py-2  transition-colors
              ${
                error
                  ? "border-red-700"
                  : isFocused
                    ? "border-indigo-500"
                    : "border-gray-300"
              }
            `}
          />
        )}
      />

      {error && <p className="text-xs text-[#d32f2f] mt-1 ml-3">{error}</p>}
    </div>
  );
}
