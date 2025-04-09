import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  role: text("role", { enum: ["admin", "seller", "buyer"] }).notNull().default("buyer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  role: true,
});

// Category model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  createdBy: integer("created_by").notNull(), // User ID
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  image: true,
  createdBy: true,
});

// Brand model
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  createdBy: integer("created_by").notNull(), // User ID
});

export const insertBrandSchema = createInsertSchema(brands).pick({
  name: true,
  image: true,
  createdBy: true,
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in paise (1/100 of rupee)
  discountPrice: integer("discount_price"),
  categoryId: integer("category_id").notNull(),
  brandId: integer("brand_id"),
  image: text("image").notNull(),
  stock: integer("stock").notNull().default(0),
  isOrganic: boolean("is_organic").notNull().default(true),
  sellerId: integer("seller_id").notNull(), // User ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  discountPrice: true,
  categoryId: true,
  brandId: true,
  image: true,
  stock: true,
  isOrganic: true,
  sellerId: true,
});

// Hero Slider model
export const heroSliders = pgTable("hero_sliders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  buttonText: text("button_text").notNull(),
  image: text("image").notNull(),
  active: boolean("active").notNull().default(true),
  createdBy: integer("created_by").notNull(), // User ID
});

export const insertHeroSliderSchema = createInsertSchema(heroSliders).pick({
  title: true,
  description: true,
  buttonText: true,
  image: true,
  active: true,
  createdBy: true,
});

// Promo Ads model
export const promoAds = pgTable("promo_ads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  buttonText: text("button_text"),
  image: text("image").notNull(),
  active: boolean("active").notNull().default(true),
  createdBy: integer("created_by").notNull(), // User ID
});

export const insertPromoAdSchema = createInsertSchema(promoAds).pick({
  title: true,
  description: true,
  buttonText: true,
  image: true,
  active: true,
  createdBy: true,
});

// E-book model
export const ebooks = pgTable("ebooks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  author: text("author").notNull(),
  image: text("image").notNull(),
  content: text("content").notNull(),
  createdBy: integer("created_by").notNull(), // User ID
});

export const insertEbookSchema = createInsertSchema(ebooks).pick({
  title: true,
  description: true,
  author: true,
  image: true,
  content: true,
  createdBy: true,
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").notNull(), // User ID
  status: text("status", { enum: ["pending", "processing", "shipped", "delivered", "cancelled"] }).notNull().default("pending"),
  totalPrice: integer("total_price").notNull(), // stored in paise
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  buyerId: true,
  status: true,
  totalPrice: true,
  address: true,
});

// Order Item model
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // stored in paise
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
});

// Cart model
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(), // User ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCartSchema = createInsertSchema(carts).pick({
  userId: true,
});

// Cart Item model
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  cartId: true,
  productId: true,
  quantity: true,
});

// Review model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  productId: true,
  userId: true,
  rating: true,
  comment: true,
});

// Wishlist model
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
});

export const insertWishlistSchema = createInsertSchema(wishlists).pick({
  userId: true,
  productId: true,
});

// Add enums for button actions
export const ButtonActions = {
  ADD_PRODUCT: "add_product",
  EDIT_PRODUCT: "edit_product",
  DELETE_PRODUCT: "delete_product",
  ADD_CATEGORY: "add_category",
  EDIT_CATEGORY: "edit_category",
  DELETE_CATEGORY: "delete_category",
  // Add more actions as needed
} as const;

export type ButtonAction = keyof typeof ButtonActions;

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type HeroSlider = typeof heroSliders.$inferSelect;
export type InsertHeroSlider = z.infer<typeof insertHeroSliderSchema>;

export type PromoAd = typeof promoAds.$inferSelect;
export type InsertPromoAd = z.infer<typeof insertPromoAdSchema>;

export type Ebook = typeof ebooks.$inferSelect;
export type InsertEbook = z.infer<typeof insertEbookSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
