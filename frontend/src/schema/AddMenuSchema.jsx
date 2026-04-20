import { z } from "zod";

const addMenuSchema = z.object({
  name: z.string().min(1, "Menu name is required"),
  date: z.string().refine((d) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(d) >= today;
  }, { message: "Date cannot be in the past" }),
  version: z.number().int().positive("Version must be a positive number"),
  categories: z
    .array(
      z.object({
        name: z.string().min(1, "Category name is required"),
        items: z
          .array(
            z.object({
              name: z.string().min(1, "Item name is required"),
              is_available: z.boolean(),
              prices: z
                .array(
                  z.object({
                    quantity: z.string().min(1, "Quantity label is required"),
                    price: z
                      .union([z.string(), z.number()])
                      .refine((v) => Number(v) > 0, "Price must be greater than 0"),
                  })
                )
                .min(1, "At least one price variant is required"),
            })
          )
          .min(1, "At least one item is required"),
      })
    )
    .min(1, "At least one category is required"),
});

export default addMenuSchema;