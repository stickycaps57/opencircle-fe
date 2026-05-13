import { useCallback, useEffect, useMemo } from "react";
import { Modal } from "../Modal";
import { CustomSelectField } from "../CustomSelectField";
import { CustomDateField } from "../CustomDateField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGoalSchema,
  editGoalSchema,
  type CreateGoalFormData,
  type EditGoalFormData,
  type GoalFormMode,
} from "@src/features/main/organization/dashboard/schema/goal.schema";
import { useCreateGoal, useUpdateGoal } from "@src/features/main/organization/dashboard/model/goal.mutation";
import { useGetGoal } from "@src/features/main/organization/dashboard/model/goal.query";
import { useAuthStore } from "@src/shared/store";
import { convertToUTC } from "@src/shared/utils";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: GoalFormMode;
  goalId?: number;
}

const GOAL_TYPES = [
  { value: "member_growth", label: "Member Growth Goal" },
  { value: "event_participation", label: "Event Participation Goal" },
  { value: "engagement", label: "Engagement Goal" },
  { value: "announcement_activity", label: "Announcement Activity Goal" },
  { value: "retention", label: "Retention Goal" },
];

export function CreateGoalModal({
  isOpen,
  onClose,
  mode = "create",
  goalId,
}: CreateGoalModalProps) {
  const { user } = useAuthStore();
  const organizationId = user?.id || 0;
  const { mutate: createGoal, isPending } = useCreateGoal(organizationId);
  const { mutate: updateGoalMutation, isPending: isUpdating } = useUpdateGoal();

  const memoizedGoalId = useMemo(() => goalId || 0, [goalId]);
  const memoizedEnabled = useMemo(
    () => mode === "edit" && !!goalId,
    [mode, goalId]
  );

  const { data: fetchedGoalData } = useGetGoal(memoizedGoalId, memoizedEnabled);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateGoalFormData | EditGoalFormData>({
    resolver: zodResolver(mode === "create" ? createGoalSchema : editGoalSchema),
    defaultValues: {
      goalName: "",
      goalType: "",
      targetNumber: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (fetchedGoalData && mode === "edit") {
      const goalStartDate = new Date(fetchedGoalData.start_date)
        .toISOString()
        .split("T")[0];
      const goalEndDate = new Date(fetchedGoalData.end_date)
        .toISOString()
        .split("T")[0];

      setValue("goalName", fetchedGoalData.title);
      setValue("goalType", fetchedGoalData.goal_type);
      setValue("targetNumber", fetchedGoalData.target_value.toString());
      setValue("startDate", goalStartDate);
      setValue("endDate", goalEndDate);
    }
  }, [fetchedGoalData, mode, setValue]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleGoalTypeChange = useCallback(
    (_name: string, value: string) => {
      setValue("goalType", value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("startDate", e.target.value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("endDate", e.target.value, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = handleSubmit((data) => {
    const formDataWithUTC = {
      ...data,
      startDate: convertToUTC(data.startDate),
      endDate: convertToUTC(data.endDate),
    };

    if (mode === "create") {
      createGoal(formDataWithUTC as CreateGoalFormData, {
        onSuccess: () => {
          handleClose();
        },
      });
    } else if (mode === "edit" && goalId) {
      updateGoalMutation(
        { goalId, formData: formDataWithUTC as CreateGoalFormData },
        {
          onSuccess: () => {
            handleClose();
          },
        }
      );
    }
  });

  const modalTitle = mode === "create" ? "Create Goal" : "Edit Goal";
  const submitButtonText = mode === "create" ? "Save" : "Update";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-responsive-base font-bold text-primary text-center">
          {modalTitle}
        </h2>
        <button
          onClick={handleClose}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Goal Name */}
        <div>
          <label className="block text-primary font-bold mb-2 text-responsive-sm">
            Goal Name
          </label>
          <input
            type="text"
            {...register("goalName")}
            className={`w-full px-4 py-3 border ${
              errors.goalName ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-responsive-sm`}
          />
          {errors.goalName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.goalName.message}
            </p>
          )}
        </div>

        {/* Goal Type */}
        <div>
          <label className="block text-primary font-bold mb-2 text-responsive-sm">
            Goal Type
          </label>
          <CustomSelectField
            name="goalType"
            value={watch("goalType")}
            onChange={handleGoalTypeChange}
            options={GOAL_TYPES}
            placeholder=""
          />
          {errors.goalType && (
            <p className="text-red-500 text-xs mt-1">
              {errors.goalType.message}
            </p>
          )}
        </div>

        {/* Target Number */}
        <div>
          <label className="block text-primary font-bold mb-2 text-responsive-sm">
            Target Number
          </label>
          <input
            type="number"
            {...register("targetNumber")}
            className={`w-full px-4 py-3 border ${
              errors.targetNumber ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-responsive-sm`}
          />
          {errors.targetNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.targetNumber.message}
            </p>
          )}
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-primary font-bold mb-2 text-responsive-sm">
            Schedule
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <CustomDateField
                name="startDate"
                value={watch("startDate")}
                onChange={handleStartDateChange}
                placeholder="Start Date"
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <CustomDateField
                name="endDate"
                value={watch("endDate")}
                onChange={handleEndDateChange}
                placeholder="End Date"
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || isUpdating}
          className="w-full bg-primary text-white py-4 rounded-full font-medium hover:bg-opacity-90 transition-colors text-responsive-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending || isUpdating ? "Saving..." : submitButtonText}
        </button>
      </form>
    </Modal>
  );
}
