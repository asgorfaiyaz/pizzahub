import { z } from "zod";

export const restaurantInfoSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Restaurant name is required.")
    .max(120, "Restaurant name is too long."),
  restaurantLocation: z
    .string()
    .trim()
    .min(2, "Restaurant location is required.")
    .max(160, "Location is too long."),
  restaurantOpeningTime: z.string().min(1, "Opening time is required."),
  restaurantClosingTime: z.string().min(1, "Closing time is required."),
  restaurantPhone: z.string().trim().max(30, "Phone number is too long."),
});

export type RestaurantInfoValues = z.infer<typeof restaurantInfoSchema>;
