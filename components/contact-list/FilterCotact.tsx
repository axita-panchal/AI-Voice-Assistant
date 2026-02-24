import { Popover, TextField, MenuItem, Button } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import PhoneInputField from "@/components/common/PhoneInputField";

export interface ContactFilterValues {
  firstName?: string;
  lastName?: string;
  phone?: string;
  outcome?: string;
}

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  control: Control<ContactFilterValues>;
  onClear: () => void;
  onApply: () => void;
}

export default function ContactFilterPopover({
  open,
  anchorEl,
  onClose,
  control,
  onClear,
  onApply,
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
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size="small" />
              )}
            />
          </div>

          {/* Last Name */}
          <div>
            <p className="text-sm font-medium">Last Name</p>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size="small" />
              )}
            />
          </div>

          {/* Phone */}
          <div>
            <PhoneInputField name="phone" control={control} />
          </div>

          {/* Outcome */}
          <div>
            <p className="text-sm font-medium">Outcome</p>
            <Controller
              name="outcome"
              control={control}
              defaultValue="all"
              render={({ field }) => (
                <TextField {...field} select fullWidth size="small">
                  <MenuItem value="all">All Outcomes</MenuItem>
                  <MenuItem value="answered">Answered</MenuItem>
                  <MenuItem value="missed">Missed</MenuItem>
                </TextField>
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
