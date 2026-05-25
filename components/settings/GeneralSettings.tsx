import { RootState } from "@/store";
import { Avatar, Button } from "@mui/material";
import { useSelector } from "react-redux";
import CustomTextField, { CustomTextFieldProps } from "@/components/common/CustomTextField";

// Custom TextField with consistent styling
const SmallTextField = (props: CustomTextFieldProps) => (
  <CustomTextField
    size="small"
    fullWidth
    {...props}
  />
);

export default function GeneralSettings() {
  const user = useSelector((state: RootState) => state?.auth?.user);

  return (
    <div className="max-w-4xl mx-auto h-full ">
      <div className=" rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">General Settings</h2>

        <label className="block text-[#565656] font-medium mb-1 ">
          Icon & Name
        </label>
        <div className="flex items-center gap-4 mb-4">
          <Avatar src="/assets/svgs/user_profile.svg" />
          <SmallTextField defaultValue={user?.full_name} placeholder="John Doe " />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Description (optional)
          </label>
          <SmallTextField multiline rows={3} placeholder="type here..." />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-1">
            Company timezone
          </label>
          <SmallTextField defaultValue="America/New-york" placeholder="Select timezone..." />
        </div>

        <h3 className="text-md font-semibold mb-4">Business Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Contact Name
            </label>
            <SmallTextField placeholder="Enter contact name..." />
          </div>

          {[
            "Contact Email",
            "Contact Phone Number",
            "Legal Business Name",
            "EIN",
            "Street Address",
            "City",
            "Zip / Postal Code",
            "State / Prov / Region",
            "Country",
          ].map((label) => (
            <div key={label}>
              <label className="block text-gray-700 font-medium mb-1">
                {label}
              </label>
              <SmallTextField placeholder={`Enter ${label.toLowerCase()}`} />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            variant="contained"
            className="bg-[#2F6AFF]! rounded-lg! px-6! capitalize!"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
