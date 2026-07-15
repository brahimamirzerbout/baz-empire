import { z } from "zod";
import { AGENCY_CATEGORIES } from "../lib/config";

/**
 * Zod validation schemas for the Agency resource.
 * `tasks` arrives as a JSON array over the wire; the storage layer
 * serializes it to a JSON string for SQLite (see controllers).
 */

const tasksField = z
  .array(z.string().min(1).max(200))
  .min(0, "tasks must be an array of strings")
  .max(50, "tasks cannot exceed 50 entries");

export const createAgencySchema = z.object({
  name: z.string().trim().min(2, "name must be at least 2 characters").max(120),
  category: z.enum(AGENCY_CATEGORIES, {
    errorMap: () => ({ message: `category must be one of: ${AGENCY_CATEGORIES.join(", ")}` }),
  }),
  shortDesc: z.string().trim().min(10, "shortDesc must be at least 10 characters").max(300),
  goal: z.string().trim().min(10, "goal must be at least 10 characters").max(2000),
  tasks: tasksField,
  modelRelevance: z.string().trim().min(10, "modelRelevance must be at least 10 characters").max(2000),
});

export const updateAgencySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  category: z
    .enum(AGENCY_CATEGORIES, {
      errorMap: () => ({ message: `category must be one of: ${AGENCY_CATEGORIES.join(", ")}` }),
    })
    .optional(),
  shortDesc: z.string().trim().min(10).max(300).optional(),
  goal: z.string().trim().min(10).max(2000).optional(),
  tasks: tasksField.optional(),
  modelRelevance: z.string().trim().min(10).max(2000).optional(),
});

export type CreateAgencyInput = z.infer<typeof createAgencySchema>;
export type UpdateAgencyInput = z.infer<typeof updateAgencySchema>;