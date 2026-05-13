import { z } from "zod";

export const createGoalSchema = z.object({
  goalName: z.string().min(1, "Goal name is required"),
  goalType: z.string().min(1, "Goal type is required"),
  targetNumber: z.string().min(1, "Target number is required").refine(
    (val) => !isNaN(Number(val)),
    "Target number must be a valid number"
  ),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).superRefine((data, ctx) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (startDate >= endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start date must be before end date",
      path: ["startDate"],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be after start date",
      path: ["endDate"],
    });
  }
});

export const editGoalSchema = createGoalSchema;

export type CreateGoalFormData = z.infer<typeof createGoalSchema>;
export type EditGoalFormData = z.infer<typeof editGoalSchema>;
export type GoalFormMode = "create" | "edit";
