import { z } from 'zod';

export const bookSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  price: z.string(),
  imageUrl: z.string(),
  category: z.string(),
  stock: z.number(),
  rating: z.string(),
  reviewCount: z.number(),
  featured: z.boolean(),
  newRelease: z.boolean()
});

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  isAdmin: z.boolean().default(false)
});

export const cartItemSchema = z.object({
  id: z.number(),
  userId: z.string(),
  bookId: z.number(),
  quantity: z.number(),
  addedAt: z.date()
});

export const orderSchema = z.object({
  id: z.number(),
  userId: z.string(),
  total: z.number(),
  status: z.string(),
  createdAt: z.date()
});

export const orderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  bookId: z.number(),
  quantity: z.number(),
  price: z.number()
});

export type Book = z.infer<typeof bookSchema>;
export type User = z.infer<typeof userSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;