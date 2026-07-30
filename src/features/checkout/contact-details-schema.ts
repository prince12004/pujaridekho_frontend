import { z } from "zod";
import { mobileSchema } from "@/lib/validators";

export const contactDetailsSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  mobile: mobileSchema,
  city: z.string().min(1, "Please select a city"),
  address: z.string().min(5, "Please enter your full address"),
  date: z.string().min(1, "Please select a date"),
  muhurat: z.string().optional(),
});

export type ContactDetailsValues = z.infer<typeof contactDetailsSchema>;
