import { z } from 'zod';

// Book schema
export const bookSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  price: z.string(),
  imageUrl: z.string().optional(),
  category: z.string(),
  stock: z.number(),
  rating: z.string(),
  reviewCount: z.number(),
  featured: z.boolean(),
  newRelease: z.boolean(),
});

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  isAdmin: z.boolean().default(false),
});

// Cart item schema
export const cartItemSchema = z.object({
  id: z.number(),
  userId: z.string(),
  bookId: z.number(),
  quantity: z.number(),
  addedAt: z.string(),
});

// Order schema
export const orderSchema = z.object({
  id: z.number(),
  userId: z.string(),
  total: z.number(),
  status: z.string(),
  createdAt: z.string(),
});

// Order item schema
export const orderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  bookId: z.number(),
  quantity: z.number(),
  price: z.string(),
});

// Export types
export type Book = z.infer<typeof bookSchema>;
export type User = z.infer<typeof userSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;