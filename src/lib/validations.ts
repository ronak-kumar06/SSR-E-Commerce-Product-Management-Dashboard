import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  price: z.number().positive('Price must be positive').max(1000000, 'Price is too high'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int('Stock must be an integer').min(0, 'Stock cannot be negative').max(1000000, 'Stock is too high'),
  imageUrl: z.string().min(1, 'Image URL is required').url('Invalid image URL'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const adminOnboardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ProductFormInput = z.infer<typeof productSchema>;
export type LoginFormInput = z.infer<typeof loginSchema>;
export type AdminOnboardInput = z.infer<typeof adminOnboardSchema>;

