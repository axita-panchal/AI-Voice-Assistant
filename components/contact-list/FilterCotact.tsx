import { Popover, MenuItem, Button } from "@mui/material";
import CustomTextField from "@/components/common/CustomTextField";
import { Control, Controller, FieldErrors } from "react-hook-form";
import PhoneInputField from "@/components/common/PhoneInputField";
import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

// export interface ContactFilterValues {
//   first_name?: string;
//   last_name?: string;
//   phone?: string;
//   outcome?: string;
// }
const contactFilterSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !!val, {
      message: "Phone number is required",
    })
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Enter a valid phone number",
    }),
  outcome: z.enum(["all", "answered", "missed"]).optional(),
});

export type ContactFilterValues = z.infer<typeof contactFilterSchema>;
export interface errorFilterValue {
  phone: string;
}

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  control: Control<ContactFilterValues>;
  onClear: () => void;
  onApply: () => void;
  contactFilterErrors: FieldErrors<ContactFilterValues>;
}

export default function ContactFilterPopover({
  open,
  anchorEl,
  onClose,
  control,
  onClear,
  onApply,
  contactFilterErrors,
}: Props) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ className: "rounded-xl p-4 w-[320px]" }}
    >
      <form onSubmit={onApply}>
        <div className="space-y-3">
          {/* First Name */}
          <div>
            <p className="text-sm font-medium">First Name</p>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth size="small" />
              )}
            />
          </div>

          {/* Last Name */}
          <div>
            <p className="text-sm font-medium">Last Name</p>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth size="small" />
              )}
            />
          </div>

          {/* Phone */}
          <div>
            <PhoneInputField
              name="phone"
              control={control}
              error={contactFilterErrors.phone?.message}
            />
          </div>

          {/* Outcome */}
          <div>
            <p className="text-sm font-medium">Outcome</p>
            <Controller
              name="outcome"
              control={control}
              defaultValue="all"
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth size="small">
                  <MenuItem value="all">All Outcomes</MenuItem>
                  <MenuItem value="answered">Answered</MenuItem>
                  <MenuItem value="missed">Missed</MenuItem>
                </CustomTextField>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <Button
              className="normal-case text-gray-500"
              onClick={onClear}
              sx={{ textTransform: "none" }}
            >
              Clear Filters
            </Button>

            <Button
              variant="contained"
              className="normal-case"
              onClick={onApply}
              sx={{ textTransform: "none" }}
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Popover>
  );
}
