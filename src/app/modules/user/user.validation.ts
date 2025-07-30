import z from "zod";
import { IsActive, Role } from "./user.interface";

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "name must be string" })
    .min(2, { message: "name too short" })
    .max(50, { message: "name too long" })
    .optional(),
  email: z.string().email().optional(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])/, {
      message: "password must contain at least 1 uppercase letter",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "password must contain 1 special chars",
    })
    .regex(/^(?=.*\d)/, {
      message: "password must contain at least 1 number",
    })
    .optional(),

  phone: z
    .string({ invalid_type_error: "phone must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "valid for BD?" })
    .optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),

  IsActive: z.enum(Object.values(IsActive) as [string]).optional(),

  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),

  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be true or false" })
    .optional(),

  address: z
    .string({ invalid_type_error: "address must be string" })
    .max(200, { message: "can't exceed 200 chars" })
    .optional(),
});
export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "name must be string" })
    .min(2, { message: "name too short" })
    .max(50, { message: "name too long" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])/, {
      message: "password must contain at least 1 uppercase letter",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "password must contain 1 special chars",
    })
    .regex(/^(?=.*\d)/, {
      message: "password must contain at least 1 number",
    }),

  phone: z
    .string({ invalid_type_error: "phone must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "valid for BD?" })
    .optional(),

  address: z
    .string({ invalid_type_error: "address must be string" })
    .max(200, { message: "can't exceed 200 chars" })
    .optional(),
});
