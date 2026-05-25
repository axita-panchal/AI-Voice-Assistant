"use client";

import {
  Checkbox,
  CircularProgress,
  Drawer,
  IconButton as MuiIconButton,
  Slider,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, forwardRef } from "react";
import CustomTextField from "@/components/common/CustomTextField";
import clsx from "clsx";
import { formatTime } from "@/utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAgents } from "@/hooks/agent/useAgentQueries";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateCampaign,
  useUpdateCampaign,
} from "@/hooks/campaign/useCampaignMutations";
import { toast } from "@/utils/toast";
import Image from "next/image";
import { Campaign } from "@/types/campaign.types";
import { Agent } from "@/types/agent.types";
import { CustomFormSelect } from "../common/CustomFormSelect";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  agentId: z.string().min(1, "Agent is required"),
  dailyCap: z
    .string()
    .min(1, "Daily usage cap is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number")
    .refine((val) => Number(val) > 0, "Must be greater than 0"),
  maxFollowUps: z
    .string()
    .min(1, "Maximum follow ups is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number")
    .refine(
      (val) => Number(val) >= 0 && Number(val) <= 35,
      "Must be between 0 and 35",
    ),
  selectedDays: z.array(z.string()).min(1, "Select at least one day"),
  hours: z.tuple([z.number(), z.number()]).refine(([min, max]) => min < max, {
    message: "Start hour must be less than end hour",
  }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const defaultValues: CampaignFormValues = {
  name: "",
  agentId: "",
  dailyCap: "",
  maxFollowUps: "",
  selectedDays: [],
  hours: [9, 20],
};

export const hourToTimeString = (hour: number) => {
  const h = hour.toString().padStart(2, "0");
  return `${h}:00:00`;
};
interface CampaignDrawerProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  campaign?: Campaign | null;
}

export default function CampaignDrawer({
  open,
  onClose,
  mode,
  campaign,
}: CampaignDrawerProps) {
  const isEdit = mode === "edit";

  const { mutateAsync: createCampaign, isPending: isCreating } =
    useCreateCampaign();

  const { mutateAsync: updateCampaign, isPending: isUpdating } =
    useUpdateCampaign();

  const subaccountId = useSelector(
    (state: RootState) => state?.workspace?.activeWorkspace?.id,
  );

  const { data: agentsResponse, isLoading } = useAgents(20, 0, subaccountId);

  const agents = agentsResponse?.data?.agents ?? [];

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
  });

  const selectedDays = watch("selectedDays");
  const hours = watch("hours");

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  /* ===================== PREFILL WHEN EDIT ===================== */

  useEffect(() => {
    if (open && isEdit && campaign) {
      reset({
        name: campaign.name || "",
        agentId: campaign.agent_id || "",
        dailyCap: String(campaign.daily_usage_cap || ""),
        maxFollowUps: String(campaign.max_dials_per_contact || ""),
        selectedDays: campaign?.calling_days || [],
        hours: [
          campaign.min_calls_per_hour || 9,
          campaign.max_calls_per_hour || 20,
        ],
      });
    }
  }, [open, isEdit, campaign, reset]);

  /* ===================== TOGGLE DAYS ===================== */

  const toggleDay = (day: string) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setValue("selectedDays", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: CampaignFormValues) => {
    try {
      const payload = {
        name: data.name,
        agent_id: data.agentId,
        min_calls_per_hour: data.hours[0],
        max_calls_per_hour: data.hours[1],
        daily_usage_cap: Number(data.dailyCap),
        max_dials_per_contact: Number(data.maxFollowUps),
        calling_days: data.selectedDays,
        start_time: hourToTimeString(data.hours[0]),
        end_time: hourToTimeString(data.hours[1]),
      };

      if (isEdit && campaign) {
        const updatedCampaignRes = await updateCampaign({
          campaignId: campaign.id,
          payload,
        });
        if (updatedCampaignRes?.data?.status_code === 200) {
          toast.success(
            updatedCampaignRes?.data?.message ||
              "Campaign updated successfully!",
          );
        }
      } else {
        const createCampaignRes = await createCampaign(payload);
        if (createCampaignRes?.data?.status_code === 200) {
          toast.success(
            createCampaignRes?.data?.message ||
              "Campaign created successfully!",
          );
        }
      }

      reset(defaultValues);
      onClose();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "w-full sm:w-[420px] max-w-full ",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-full flex flex-col p-4 sm:p-6"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1 border border-gray-300 rounded-md">
              <Image
                src="/assets/svgs/campaign.svg"
                alt="Campaign"
                width={16}
                height={16}
              />
            </div>
            <span className="text-base text-[#464646]">
              {isEdit ? "Edit Campaign" : "Add Campaign"}
            </span>
          </div>

          <MuiIconButton onClick={onClose}>
            <CloseIcon />
          </MuiIconButton>
        </div>

        {/* BODY */}
        <div className="flex-1 space-y-5 overflow-y-auto text-sm pr-1 sm:pr-2">
          <FormInput
            label="Name"
            placeholder="John"
            error={errors.name?.message}
            {...register("name")}
          />
          <CustomFormSelect
            label="Agent"
            placeholder="Choose an option.."
            error={errors.agentId?.message}
            disabled={isLoading || agents.length === 0}
            options={agents.map((agent: Agent) => ({
              label: agent.name,
              value: agent.id,
            }))}
            {...register("agentId")}
          />
          <FormInput
            label="Daily Usage Cap"
            placeholder="20"
            error={errors.dailyCap?.message}
            {...register("dailyCap")}
          />
          <FormInput
            label="Maximum Follow Ups"
            placeholder="0 - 15"
            error={errors.maxFollowUps?.message}
            {...register("maxFollowUps")}
          />
          {/* CALLING DAYS */}
          <div>
            <p className="text-sm font-medium mb-2">Calling days</p>

            <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-3">
              {DAYS.map((day) => {
                const checked = selectedDays.includes(day);
                return (
                  <div
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={clsx(
                      "h-14 flex flex-col items-center justify-center cursor-pointer rounded-lg",
                      "transition-colors",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      size="small"
                      sx={{
                        // borderRadius: "6px",
                        color: "#C3C3C3",
                        "&.Mui-checked": {
                          color: "bg-[#2F6AFF]",
                        },
                      }}
                    />
                    <span className="text-sm text-[#808080]">{day}</span>
                  </div>
                );
              })}
            </div>

            {errors.selectedDays && (
              <p className="text-red-500 text-xs mt-1">
                {errors.selectedDays.message}
              </p>
            )}
          </div>

          {/* HOURS */}
          <div>
            <p className="text-sm font-medium mb-2">Local calling hours</p>
            <Controller
              control={control}
              name="hours"
              render={({ field }) => (
                <Slider
                  {...field}
                  value={field.value}
                  min={0}
                  max={24}
                  step={1}
                  disableSwap
                  onChange={(_, value) => {
                    const [min, max] = value as number[];
                    if (min >= max) return;
                    field.onChange([min, max]);
                  }}
                />
              )}
            />
            <div className="flex justify-between text-xs mt-1">
              <span>{formatTime(hours[0])}</span>
              <span>{formatTime(hours[1])}</span>
            </div>
            {errors.hours && (
              <p className="text-red-500 text-xs mt-1">
                {errors.hours.message}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 bg-gray-100 py-2 rounded-lg text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="w-full sm:flex-1 bg-[#2F6AFF] text-white py-2 rounded-lg text-sm cursor-pointer"
          >
            {(isUpdating || isCreating) && (
              <CircularProgress
                size={18}
                sx={{ color: "#fff", mr: 1 }}
                aria-hidden="true"
              />
            )}
            {isEdit
              ? isUpdating
                ? "Updating..."
                : "Update"
              : isCreating
                ? "Creating..."
                : "Finish"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

/* ===================== REUSABLE INPUT ===================== */

const FormInput = forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof CustomTextField>, "error"> & {
    label: string;
    error?: string;
  }
>(({ label, error, ...props }, ref) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>
      <CustomTextField
        ref={ref}
        fullWidth
        size="small"
        error={!!error}
        helperText={error}
        {...props}
      />
    </div>
  );
});

FormInput.displayName = "FormInput";
